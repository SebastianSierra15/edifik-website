import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectView } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  // 🔹 Inicia medición de tiempo total de API
  const startAPITime = performance.now();
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const numberProjects = parseInt(
      searchParams.get("numberProjects") || "3",
      10
    );

    // 🔹 Inicia medición de la consulta SQL
    const startDBQuery = performance.now();
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_company_projects(?)",
      [numberProjects]
    );
    const endDBQuery = performance.now();

    // 🔹 Inicia medición de procesamiento de datos
    const startProcessing = performance.now();
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
      images: projectMediaMap[row.id] || [],
    }));
    const endProcessing = performance.now();

    // 🔹 Finaliza medición del tiempo total de API
    const endAPITime = performance.now();

    const response = NextResponse.json({ projects });
    response.headers.set(
      "Server-Timing",
      `db_query;dur=${(endDBQuery - startDBQuery).toFixed(2)}, processing;dur=${(endProcessing - startProcessing).toFixed(2)}, total_api;dur=${(endAPITime - startAPITime).toFixed(2)}`
    );
    return response;
  } catch (error) {
    console.error("Error en la búsqueda de propiedades: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar propiedades" },
      { status: 500 }
    );
  }
}
