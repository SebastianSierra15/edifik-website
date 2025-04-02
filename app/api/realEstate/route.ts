import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectView } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const price = parseInt(searchParams.get("price") || "", 10) || null;
    const area = searchParams.get("area");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const lobbies = searchParams.get("lobbies");
    const projectTypeId = parseInt(
      searchParams.get("projectTypeId") || "2",
      10
    );

    const minLat = searchParams.has("minLat")
      ? parseFloat(searchParams.get("minLat")!)
      : null;
    const maxLat = searchParams.has("maxLat")
      ? parseFloat(searchParams.get("maxLat")!)
      : null;
    const minLng = searchParams.has("minLng")
      ? parseFloat(searchParams.get("minLng")!)
      : null;
    const maxLng = searchParams.has("maxLng")
      ? parseFloat(searchParams.get("maxLng")!)
      : null;

    const latitude = searchParams.has("latitude")
      ? parseFloat(searchParams.get("latitude")!)
      : null;
    const longitude = searchParams.has("longitude")
      ? parseFloat(searchParams.get("longitude")!)
      : null;

    const parseCommaSeparated = (param: string | null): string | null =>
      param ? JSON.stringify(param.split(",").map(Number)) : null;

    const cities = parseCommaSeparated(searchParams.get("cities"));
    const propertyTypes = parseCommaSeparated(
      searchParams.get("propertyTypes")
    );
    const housingTypes = parseCommaSeparated(searchParams.get("housingTypes"));
    const commonAreas = parseCommaSeparated(searchParams.get("commonAreas"));
    const nearbyServices = parseCommaSeparated(
      searchParams.get("nearbyServices")
    );

    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 ? pageSize : 16;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_properties(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        validatedPage,
        validatedPageSize,
        cities || null,
        propertyTypes || null,
        housingTypes || null,
        price || null,
        area || null,
        bedrooms || null,
        bathrooms || null,
        lobbies || null,
        commonAreas || null,
        nearbyServices || null,
        projectTypeId || 2,
        minLat || null,
        maxLat || null,
        minLng || null,
        maxLng || null,
        latitude,
        longitude,
      ]
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

    const projects: ProjectView[] = projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      cityName: row.cityName,
      price: row.price,
      area: row.area,
      bathrooms: row.bathrooms,
      parkingSpots: row.parkingSpots,
      bedrooms: row.bedrooms,
      longitude: row.longitude,
      latitude: row.latitude,
      images: projectMediaMap[row.id] || [],
    }));

    const response = NextResponse.json({ projects, totalEntries });

    return response;
  } catch (error) {
    console.error("Error en la búsqueda de propiedades: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar propiedades" },
      { status: 500 }
    );
  }
}
