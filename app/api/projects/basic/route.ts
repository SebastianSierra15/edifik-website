import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectView } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query<RowDataPacket[][]>("CALL get_projects()");

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

    const projects: ProjectView[] = projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      cityName: row.cityName,
      price: row.price,
      area: row.area,
      bathrooms: row.bathrooms,
      parkingSpots: row.parkingSpots,
      bedrooms: row.bedrooms,
      images: projectMediaMap[row.id] || [],
    }));

    return NextResponse.json({ projects, totalEntries });
  } catch (error) {
    console.error("Error al obtener proyectos: ", error);
    return NextResponse.json(
      { error: "Fallo al obtener proyectos" },
      { status: 500 }
    );
  }
}
