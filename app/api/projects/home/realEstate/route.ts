import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectView } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const numberProjects = parseInt(
      searchParams.get("numberProjects") || "3",
      10
    );

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_real_estate_projects(?)",
      [numberProjects]
    );

    const [projectsRows = [], projectMediaRows = []] = result;

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

    const response = NextResponse.json({ projects });

    return response;
  } catch (error) {
    console.error("Error en la búsqueda de propiedades: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar propiedades" },
      { status: 500 }
    );
  }
}
