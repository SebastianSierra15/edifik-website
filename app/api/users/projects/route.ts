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

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const userId = parseInt(searchParams.get("userId") || "0", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    if (!userId || userId <= 0) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 ? pageSize : 16;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_project_list(?, ?, ?)",
      [userId, validatedPage, validatedPageSize]
    );

    const [projectsRows = [], projectMediaRows = [], [totalEntriesRow] = []] =
      result;
    const totalEntries = totalEntriesRow.totalEntries || 0;

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

    const response = NextResponse.json({ projects, totalEntries });

    return response;
  } catch (error) {
    console.error("Error en la búsqueda de proyectos del usuario: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar proyectos del usuario" },
      { status: 500 }
    );
  }
}
