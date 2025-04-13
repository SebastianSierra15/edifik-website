import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectSummary } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

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
    const session = await getServerSession(authOptions);
    const permissions = session?.user?.permissions || [];

    const hasPermission = permissions?.some(
      (perm) => perm.name === "Gestionar proyectos"
    );

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
      "CALL get_projects_admin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
      email: hasPermission ? row.email : "Usuario Privado",
      projectMedia: projectMediaMap[row.id] || [],
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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermissionToManageProperties =
    permissions?.some((perm) => perm.name === "Gestionar propiedades") || false;

  const client =
    permissions?.some(
      (perm) => perm.name === "Gestionar propiedades propias"
    ) || false;

  const hasPermission =
    hasPermissionToManageProperties ||
    permissions?.some(
      (perm) =>
        perm.name === "Gestionar proyectos" ||
        perm.name === "Gestionar propiedades propias"
    );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const projectData = await req.json();

    const {
      id,
      name,
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
      ownerId,
      email,
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
      !client ? "1" : "3", //state
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
      hasPermissionToManageProperties
        ? ownerId !== undefined && ownerId !== null
          ? ownerId
          : 1
        : userId || null,
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
    } else if (!client) {
      const emailContent = generateEmailTemplate({
        title: "Propiedad Editada en EdifiK",
        intro:
          "Una propiedad ha sido modificada recientemente en la plataforma.",
        items: [
          { label: "Nombre de la Propiedad", value: name },
          {
            label: "Propietario",
            value: email ?? ownerId?.toString() ?? session.user.email,
          },
        ],
        body: "Le recomendamos revisar los cambios en el sistema administrativo.",
        buttonText: "Ver propiedad",
        buttonUrl: "https://edifik.co/admin/solicitudes",
      });

      await sendEmail(
        "sebasirra13@gmail.com",
        "Propiedad Editada en EdifiK",
        emailContent
      );
    }

    const response = NextResponse.json(
      {
        message: "Proyecto actualizado correctamente.",
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proyecto." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermissionToManageProperties =
    permissions?.some((perm) => perm.name === "Gestionar propiedades") || false;

  const client =
    permissions?.some(
      (perm) => perm.name === "Gestionar propiedades propias"
    ) || false;

  const hasPermission =
    hasPermissionToManageProperties ||
    permissions?.some(
      (perm) =>
        perm.name === "Gestionar proyectos" ||
        perm.name === "Gestionar propiedades propias"
    );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const projectData = await req.json();

    const {
      name,
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
      ownerId,
      email,
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
      !client ? "1" : "2", //state
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
      hasPermissionToManageProperties
        ? ownerId !== undefined && ownerId !== null
          ? ownerId
          : 1
        : userId || null,
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
    } else if (client) {
      const emailContent = generateEmailTemplate({
        title: "Nueva Propiedad Registrada",
        intro: "Se ha registrado una nueva propiedad en la plataforma EdifiK.",
        items: [
          { label: "Nombre de la Propiedad", value: name },
          {
            label: "Propietario",
            value: email ?? ownerId?.toString() ?? session.user.email,
          },
        ],
        body: "Le recomendamos revisar y validar la información en el sistema administrativo.",
        buttonText: "Ingresar a EdifiK",
        buttonUrl: "https://edifik.co/solicitudes",
      });

      await sendEmail(
        "sebasirra13@gmail.com",
        "Nueva Propiedad Registrada en EdifiK",
        emailContent
      );
    }

    const response = NextResponse.json(
      {
        message: "Proyecto creado correctamente.",
        projectId,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error al crear la propiedad:", error);
    return NextResponse.json(
      { error: "Error al crear el proyecto." },
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
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades" ||
      perm.name === "Gestionar propiedades propias"
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

    await db.query("CALL delete_project_state(?, ?)", [projectId, userId]);

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
