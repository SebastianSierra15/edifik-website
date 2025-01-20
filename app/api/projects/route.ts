import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectSummary } from "@/lib/definitios";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { RowDataPacket } from "mysql2";

const formatDateForMySQL = (date: any) => {
  if (!date) return null;
  const validDate = date instanceof Date ? date : new Date(date);
  if (isNaN(validDate.getTime())) {
    throw new Error("Fecha inválida proporcionada");
  }
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const day = String(validDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const searchTerm = escapeSearchTerm(searchParams.get("searchTerm") || "");
    const price = parseInt(searchParams.get("price") || "", 10) || null;
    const area = searchParams.get("area");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const lobbies = searchParams.get("lobbies");
    const projectTypeId = parseInt(
      searchParams.get("projectTypeId") || "1",
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

    const parseCommaSeparated = (param: string | null): string | null =>
      param ? JSON.stringify(param.split(",").map(Number)) : null;

    const cities = parseCommaSeparated(searchParams.get("cities"));
    const propertyTypes = parseCommaSeparated(
      searchParams.get("propertyTypes")
    );
    const housingTypes = parseCommaSeparated(searchParams.get("housingTypes"));
    const memberships = parseCommaSeparated(searchParams.get("memberships"));
    const commonAreas = parseCommaSeparated(searchParams.get("commonAreas"));
    const nearbyServices = parseCommaSeparated(
      searchParams.get("nearbyServices")
    );

    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 ? pageSize : 16;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_projects(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        validatedPage,
        validatedPageSize,
        cities || null,
        propertyTypes || null,
        housingTypes || null,
        memberships || null,
        price || null,
        area || null,
        bedrooms || null,
        bathrooms || null,
        lobbies || null,
        projectTypeId || 1,
        commonAreas || null,
        nearbyServices || null,
        searchTerm,
        minLat || null,
        maxLat || null,
        minLng || null,
        maxLng || null,
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

    const projects: ProjectSummary[] = projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      totalArea: row.area,
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
    console.error("Error en la búsqueda de propiedades: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar propiedades" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const projectData = await req.json();

    const {
      name,
      state,
      price,
      builtArea,
      totalArea,
      freeHeight,
      width,
      length,
      parkingSpots,
      elevators,
      heavyParking,
      availableUnits,
      bathrooms,
      bedrooms,
      lobbies,
      towers,
      storageUnits,
      socioeconomicLevel,
      floorNumber,
      yearBuilt,
      customizationOptions,
      terrace,
      balcony,
      garden,
      laundryArea,
      complexName,
      shortDescription,
      detailedDescription,
      address,
      latitude,
      longitude,
      availableDate,
      propertyType,
      housingType,
      city,
      membership,
      user,
      projectType,
      statusProject,
      commonAreas,
      nearbyServices,
    } = projectData;

    if (
      !name ||
      !price ||
      !builtArea ||
      !totalArea ||
      !shortDescription ||
      !detailedDescription ||
      !address ||
      !latitude ||
      !longitude ||
      !propertyType?.id ||
      !city?.name ||
      !city?.departament?.name
    ) {
      console.error("Faltan datos obligatorios para crear el proyecto.");
      return NextResponse.json(
        { error: "Faltan datos obligatorios para crear el proyecto." },
        { status: 400 }
      );
    }

    const commonAreaIds = commonAreas
      ? JSON.stringify(commonAreas.map((area: { id: number }) => area.id))
      : "[]";
    const nearbyServiceIds = nearbyServices
      ? JSON.stringify(
          nearbyServices.map((service: { id: number }) => service.id)
        )
      : "[]";

    const housingTypeId = housingType?.id || null;
    const statusProjectId = statusProject?.id || null;
    const userId = user?.id || null;

    const queryParams = [
      name,
      state !== undefined && state !== null
        ? state
        : userId === 1
          ? true
          : false,
      price,
      builtArea,
      totalArea,
      freeHeight || null,
      width || null,
      length || null,
      parkingSpots || 0,
      elevators || 0,
      availableUnits || 0,
      heavyParking || null,
      bedrooms || null,
      bathrooms || 0,
      lobbies || 0,
      towers || null,
      storageUnits || null,
      socioeconomicLevel || null,
      floorNumber || null,
      yearBuilt || null,
      customizationOptions || false,
      balcony || false,
      terrace || null,
      garden || null,
      laundryArea || false,
      complexName || null,
      shortDescription,
      detailedDescription,
      address,
      latitude,
      longitude,
      formatDateForMySQL(availableDate) || null,
      city.name,
      city.departament.name,
      housingTypeId || null,
      membership || 1001,
      propertyType.id,
      userId || 1,
      projectType.id,
      statusProjectId || 1,
      commonAreaIds,
      nearbyServiceIds,
    ];

    const [result] = await db.query(
      "CALL create_project(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      queryParams
    );

    const projectIdRow = (result as any[][])[0][0];
    const projectId = projectIdRow?.projectId;

    if (!projectId) {
      console.error("No se pudo obtener el ID del proyecto.");
      return NextResponse.json(
        { error: "No se pudo crear el proyecto correctamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Proyecto creado correctamente.",
      projectId,
    });
  } catch (error) {
    console.error("Error al crear la propiedad:", error);
    return NextResponse.json(
      { error: "Error al crear el proyecto." },
      { status: 500 }
    );
  }
}
