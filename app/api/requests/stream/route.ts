import { NextRequest } from "next/server";
import { requireAuth, requirePermission, Permission } from "@/src/modules/auth";
import { observePendingRequestsController } from "@/src/modules/requests";

export async function GET(req: NextRequest) {
  await requireAuth();
  await requirePermission(Permission.ManageRequests);

  const encoder = new TextEncoder();
  const controllerApi = observePendingRequestsController();

  const stream = new ReadableStream({
    async start(controller) {
      let lastData: string | null = null;

      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const heartbeat = setInterval(() => {
        send({ type: "heartbeat" });
      }, 10_000);

      const poll = async () => {
        const data = await controllerApi.fetch();
        const serialized = JSON.stringify(data);

        if (serialized !== lastData) {
          send({ type: "pendingRequests", data });
          lastData = serialized;
        }
      };

      const interval = setInterval(poll, 10_000);

      req.signal.onabort = () => {
        clearInterval(interval);
        clearInterval(heartbeat);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
