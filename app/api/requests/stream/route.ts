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
        try {
          if (controller.desiredSize !== null) {
            // Solo enviar si el stream sigue abierto
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          }
        } catch (err) {
          console.error("⚠️ Error en sendEvent: Stream cerrado", err);
        }
      };

      const heartbeat = setInterval(() => {
        if (controller.desiredSize !== null) {
          // Solo enviar si el stream sigue abierto
          sendEvent({ type: "heartbeat", message: "Conexión activa" });
        }
      }, 10000); // Reducir a 10s

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
            sendEvent({ type: "newRequests", data: requests });
            lastRequests = requests;
          }
        } catch (error) {
          console.error(
            "Error al recuperar las solicitudes pendientes:",
            error
          );
        }
      };

      const interval = setInterval(checkForNewRequests, 10000);

      req.signal.onabort = () => {
        console.warn("🔴 Conexión SSE cerrada por el cliente");
        clearInterval(interval);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch (err) {
          console.error("⚠️ Error al cerrar el stream:", err);
        }
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
