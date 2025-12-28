import { NextRequest } from "next/server";
import {
  requireAuthWithPermissions,
  Permission,
} from "@/src/modules/auth";
import { observePendingRequestsController } from "@/src/modules/requests";

export async function GET(req: NextRequest) {
  await requireAuthWithPermissions([Permission.ManageRequests]);

  const encoder = new TextEncoder();
  const controllerApi = observePendingRequestsController();
  let isClosed = false;
  let interval: ReturnType<typeof setInterval> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      let lastData: string | null = null;

      const closeStream = () => {
        if (isClosed) return;
        isClosed = true;

        if (interval) {
          clearInterval(interval);
        }

        if (heartbeat) {
          clearInterval(heartbeat);
        }

        try {
          controller.close();
        } catch {
          // Ignore close errors from already closed controller.
        }
      };

      const send = (data: any) => {
        if (isClosed || req.signal.aborted) return;

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          closeStream();
        }
      };

      heartbeat = setInterval(() => {
        send({ type: "heartbeat" });
      }, 10_000);

      const poll = async () => {
        if (isClosed || req.signal.aborted) return;

        try {
          const data = await controllerApi.fetch();
          const serialized = JSON.stringify(data);

          if (serialized !== lastData) {
            send({ type: "pendingRequests", data });
            lastData = serialized;
          }
        } catch {
          // Avoid unhandled rejections during streaming errors.
        }
      };

      interval = setInterval(poll, 10_000);
      void poll();

      req.signal.addEventListener("abort", closeStream);
    },
    cancel() {
      isClosed = true;

      if (interval) {
        clearInterval(interval);
      }

      if (heartbeat) {
        clearInterval(heartbeat);
      }
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
