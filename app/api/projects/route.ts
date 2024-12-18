import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectSummary } from "@/lib/definitios";

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const getQueryParam = (paramName: string): string | null => {
      const value = url.searchParams.get(paramName);
      return value !== null && value.trim() !== "" ? value : null;
    };

    const parseCommaSeparatedToJson = (param: string | null): string | null => {
      if (!param) return null;
      const array = param.split(",").map((id) => parseInt(id.trim(), 10));
      return JSON.stringify(array);
    };

    const page = parseInt(getQueryParam("page") || "1", 10);
    const pageSize = parseInt(getQueryParam("pageSize") || "16", 10);
    const price = getQueryParam("price");
    const area = getQueryParam("area");
    const bedrooms = getQueryParam("bedrooms");
    const bathrooms = getQueryParam("bathrooms");
    const lobbies = getQueryParam("lobbies");
    const projectTypeId = getQueryParam("projectTypeId");
    const searchTerm = getQueryParam("searchTerm");

    const cities = parseCommaSeparatedToJson(getQueryParam("cities"));
    const propertyTypes = parseCommaSeparatedToJson(
      getQueryParam("propertyTypes")
    );
    const housingTypes = parseCommaSeparatedToJson(
      getQueryParam("housingTypes")
    );
    const memberships = parseCommaSeparatedToJson(getQueryParam("memberships"));
    const commonAreas = parseCommaSeparatedToJson(getQueryParam("commonAreas"));
    const nearbyServices = parseCommaSeparatedToJson(
      getQueryParam("nearbyServices")
    );

    const validatedPage = !isNaN(page) && page > 0 ? page : 1;
    const validatedPageSize = !isNaN(pageSize) && pageSize > 0 ? pageSize : 16;

    const [result] = await db.query(
      "CALL get_projects(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        validatedPage,
        validatedPageSize,
        cities,
        propertyTypes,
        housingTypes,
        memberships,
        price,
        area,
        bedrooms,
        bathrooms,
        lobbies,
        projectTypeId || 1,
        commonAreas,
        nearbyServices,
        searchTerm,
      ]
    );

    const rows = (result as RowDataPacket[][])[0];
    const projectMediaRows = (result as RowDataPacket[][])[1];
    const totalEntriesRow = (result as RowDataPacket[][])[2][0];
    const totalEntries = totalEntriesRow.totalEntries;

    if (rows.length === 0) {
      return NextResponse.json({ projects: [], totalEntries: 0 });
    }

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

    const projects: ProjectSummary[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      totalArea: row.area,
      longitude: row.longitude,
      latitude: row.latitude,
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

export async function POST(request: Request) {
  try {
    const projectData = await request.json();

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
