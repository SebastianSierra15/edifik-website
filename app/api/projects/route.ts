import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectSummary } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      price: row.price || null,
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
      username: row.username,
      projectMedia: projectMediaMap[row.id] || [],
    }));

    return NextResponse.json({ projects, totalEntries }, { status: 200 });
  } catch (error) {
    console.error("Error en la búsqueda de propiedades: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar propiedades" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    const projectData = await req.json();

    const {
      id,
      name,
      state,
      price,
      builtArea,
      totalArea,
      freeHeight,
      width,
      length,
      parkingSpots,
      elevator,
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
      projectType,
      statusProject,
      commonAreas,
      nearbyServices,
      residentialProjectId,
      warehouseProjectId,
    } = projectData;

    if (
      !id ||
      !name ||
      !builtArea ||
      !totalArea ||
      !shortDescription ||
      !detailedDescription ||
      !address ||
      !latitude ||
      !longitude ||
      !propertyType?.id ||
      !city?.id ||
      !city?.departament?.id
    ) {
      console.error("Faltan datos obligatorios para actualizar el proyecto.");
      return NextResponse.json(
        { error: "Faltan datos obligatorios para actualizar el proyecto." },
        { status: 400 }
      );
    }

    const commonAreaIds = commonAreas
      ? JSON.stringify(commonAreas.map((area: { id: number }) => area.id))
      : null;
    const nearbyServiceIds = nearbyServices
      ? JSON.stringify(
          nearbyServices.map((service: { id: number }) => service.id)
        )
      : null;

    const housingTypeId = housingType?.id || null;
    const statusProjectId = statusProject?.id || null;

    const queryParams = [
      id,
      name,
      state !== undefined && state !== null
        ? state
        : Number(userRole) === 1
          ? true
          : false,
      price,
      builtArea,
      totalArea,
      freeHeight || null,
      width || null,
      length || null,
      parkingSpots || 0,
      elevator || 0,
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
      city.id,
      housingTypeId || null,
      membership || 1001,
      propertyType.id,
      projectType.id,
      statusProjectId || 1,
      residentialProjectId || null,
      warehouseProjectId || null,
      commonAreaIds,
      nearbyServiceIds,
      userRole !== undefined && Number(userRole) === 1 ? 1 : userId || null,
    ];

    const [result] = await db.query(
      "CALL update_project(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      queryParams
    );

    if (!result) {
      console.error("No se pudo obtener la respuesta de la base de datos.");
      return NextResponse.json(
        { error: "No se pudo actualizar el proyecto correctamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Proyecto actualizado correctamente.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proyecto." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

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
      elevator,
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
      projectType,
      statusProject,
      commonAreas,
      nearbyServices,
    } = projectData;

    if (
      !name ||
      !builtArea ||
      !totalArea ||
      !shortDescription ||
      !detailedDescription ||
      !address ||
      !latitude ||
      !longitude ||
      !propertyType?.id ||
      !city?.id ||
      !city?.departament?.id
    ) {
      console.error("Faltan datos obligatorios para crear el proyecto.");
      return NextResponse.json(
        { error: "Faltan datos obligatorios para crear el proyecto." },
        { status: 400 }
      );
    }

    const commonAreaIds = commonAreas
      ? JSON.stringify(commonAreas.map((area: { id: number }) => area.id))
      : null;
    const nearbyServiceIds = nearbyServices
      ? JSON.stringify(
          nearbyServices.map((service: { id: number }) => service.id)
        )
      : null;

    const housingTypeId = housingType?.id || null;
    const statusProjectId = statusProject?.id || null;

    const queryParams = [
      name,
      state !== undefined && state !== null
        ? state
        : Number(userRole) === 1
          ? true
          : false,
      price,
      builtArea,
      totalArea,
      freeHeight || null,
      width || null,
      length || null,
      parkingSpots || 0,
      elevator || 0,
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
      city.id,
      housingTypeId || null,
      membership || 1001,
      propertyType.id,
      projectType.id,
      statusProjectId || 1,
      commonAreaIds,
      nearbyServiceIds,
      userRole !== undefined && Number(userRole) === 1 ? 1 : userId || null,
    ];

    const [result] = await db.query(
      "CALL create_project(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

    return NextResponse.json(
      {
        message: "Proyecto creado correctamente.",
        projectId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al crear la propiedad:", error);
    return NextResponse.json(
      { error: "Error al crear el proyecto." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const url = new URL(req.url);
    const projectId = parseInt(url.searchParams.get("id") || "", 10);

    if (!projectId) {
      return NextResponse.json(
        { error: "ID del proyecto no proporcionado o inválido." },
        { status: 400 }
      );
    }

    await db.query("CALL delete_project(?, ?)", [projectId, userId]);

    return NextResponse.json(
      { message: "Proyecto eliminado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proyecto." },
      { status: 500 }
    );
  }
}
