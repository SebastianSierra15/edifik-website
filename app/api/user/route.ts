import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectSummary } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = parseInt(session?.user?.id ?? "0", 10);
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const statusProject = parseInt(
      searchParams.get("statusProject") || "2",
      10
    );
    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 ? pageSize : 16;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_projects(?, ?, ?, ?)",
      [userId, validatedPage, validatedPageSize, statusProject]
    );

    const [projectsRows = [], projectMediaRows = [], [totalEntriesRow] = []] =
      result;
    const totalEntries = totalEntriesRow?.totalEntries || 0;

    const projectMediaMap: Record<
      number,
      { url: string; tag: string; projectId: number }[]
    > = {};
    projectMediaRows.forEach((media: any) => {
      if (!projectMediaMap[media.projectId]) {
        projectMediaMap[media.projectId] = [];
      }
      projectMediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    });

    const projects: ProjectSummary[] = projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price || null,
      totalArea: row.area,
      bedrooms: row.bedrooms || null,
      bathrooms: row.bathrooms || null,
      parkingSpots: row.parkingSpots || null,
      longitude: row.longitude as number,
      latitude: row.latitude as number,
      address: row.address,
      city: {
        id: row.cityId,
        name: row.cityName,
        departament: {
          id: row.departamentId,
          name: row.departamentName,
        },
      },
      projectMedia: projectMediaMap[row.id] || [],
    }));

    return NextResponse.json({ projects, totalEntries });
  } catch (error) {
    console.error("Error al obtener proyectos del usuario:", error);
    return NextResponse.json(
      { error: "Fallo al obtener proyectos del usuario" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar propiedades propias"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const url = new URL(req.url);
    const projectId = parseInt(url.searchParams.get("id") || "", 10);

    if (!projectId) {
      return NextResponse.json(
        { error: "ID del proyecto no proporcionado o inválido." },
        { status: 400 }
      );
    }

    await db.query("CALL delete_user_project(?, ?)", [projectId, userId]);

    const response = NextResponse.json(
      { message: "Proyecto eliminado correctamente." },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proyecto." },
      { status: 500 }
    );
  }
}
