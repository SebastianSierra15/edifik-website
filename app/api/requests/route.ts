import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Request } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchTerm = escapeSearchTerm(searchParams.get("searchTerm") || null);

  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_requests(?, ?, ?)",
      [page, pageSize, searchTerm]
    );

    const [requestRows = [], [totalEntriesRow] = []] = result;

    const totalEntries = totalEntriesRow?.totalEntries || 0;

    const requests: Request[] = requestRows.map((row: any) => ({
      id: row.id,
      date: row.date,
      operation: row.operation ? "agregar" : "editar",
      responseMessage: row.responseMessage,
      userId: row.userId,
      userEmail: row.userEmail,
      statusRequestName: row.statusRequestName,
      projectId: row.projectId,
      projectName: row.projectName,
    }));

    const response = NextResponse.json({
      requests,
      totalEntries,
    });

    return response;
  } catch (error) {
    console.error("Error al recuperar las solicitudes:", error);
    return NextResponse.json(
      { error: "Error al recuperar las solicitudes" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const { id, statusId, responseMessage, userEmail } = await req.json();

    if (!id || !statusId || !responseMessage || !userEmail) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const [result] = await db.query("CALL update_request(?, ?, ?, ?)", [
      id,
      statusId,
      responseMessage,
      userId,
    ]);

    const statusMap: Record<number, string> = {
      2: "aprobada",
      3: "rechazada",
      4: "enviada a revisión",
    };

    const statusName = statusMap[statusId];
    const subject = `Tu solicitud ha sido ${statusName}`;

    const htmlContent = generateEmailTemplate({
      title: subject,
      greeting: "Hola,",
      intro: `Hemos revisado tu solicitud y ha sido <strong>${statusName}</strong>.`,
      body: `<strong>Respuesta del revisor:</strong> ${responseMessage}`,
      buttonText: "Ver mis propiedades",
      buttonUrl: "https://edifik.co/usuario/mis-propiedades",
    });

    await sendEmail(userEmail, subject, htmlContent);

    const response = NextResponse.json(
      { message: "Solicitud actualizada correctamente", result },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return NextResponse.json(
      { error: "Error al actualizar la solicitud" },
      { status: 500 }
    );
  }
}
