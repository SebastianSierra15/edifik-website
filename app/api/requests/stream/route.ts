import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("No autenticado", { status: 401 });
  }

  const permissions = session?.user?.permissions;
  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  if (!hasPermission) {
    return new Response("Acceso denegado", { status: 403 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let lastRequests: any[] = [];

      const checkForNewRequests = async () => {
        try {
          const [result] = await db.query<RowDataPacket[][]>(
            "CALL get_pending_requests()"
          );

          const requestRows = result[0] || [];
          const requests = requestRows.map((row: any) => ({
            id: row.id,
            date: row.date,
            operation: row.operation ? "agregar" : "editar",
            userEmail: row.userEmail,
            statusRequestName: row.statusRequestName,
            projectName: row.projectName,
          }));

          const hasChanged =
            JSON.stringify(requests) !== JSON.stringify(lastRequests);

          if (hasChanged) {
            if (hasChanged) {
              sendEvent({ type: "newRequests", data: requests });
              lastRequests = requests;
            }
          }
        } catch (error) {
          console.error(
            "Error al recuperar las solicitudes pendientes:",
            error
          );
        }
      };

      const interval = setInterval(checkForNewRequests, 5000);

      req.signal.onabort = () => {
        clearInterval(interval);
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
