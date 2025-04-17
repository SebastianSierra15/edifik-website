import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Project } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const permissions = session?.user?.permissions || [];

    const hasPermission = permissions?.some(
      (perm) =>
        perm.name === "Gestionar proyectos" ||
        perm.name === "Gestionar propiedades" ||
        perm.name === "Gestionar propiedades propias"
    );

    const projectId = Number(context.params.id);

    if (!projectId) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const isProjectParam = searchParams.get("isProject");
    const isAdminParam = searchParams.get("isAdmin");

    if (isProjectParam === null) {
      return NextResponse.json(
        { error: "El parámetro 'isProject' es requerido" },
        { status: 400 }
      );
    }

    const isProject = parseInt(isProjectParam, 10);
    const isAdmin = parseInt(isAdminParam ?? "0", 10);

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_project_by_id(?, ?, ?)",
      [projectId, isProject, isAdmin]
    );

    const [
      projectsRows = [],
      nearbyServicesRows = [],
      commonAreasRows = [],
      projectMediaRows = [],
    ] = result;

    if (projectsRows.length === 0) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    const project: Project = {
      id: projectsRows[0].id,
      name: projectsRows[0].name,
      state: projectsRows[0].state,
      price: projectsRows[0].price,
      totalArea: projectsRows[0].totalArea,
      builtArea: projectsRows[0].builtArea,
      freeHeight: projectsRows[0].freeHeight,
      width: projectsRows[0].width,
      length: projectsRows[0].length,
      parkingSpots: projectsRows[0].parkingSpots,
      elevator: projectsRows[0].elevator,
      heavyParking: projectsRows[0].heavyParking,
      availableUnits: projectsRows[0].availableUnits,
      bathrooms: projectsRows[0].bathrooms,
      bedrooms: projectsRows[0].bedrooms,
      lobbies: projectsRows[0].lobbies,
      towers: projectsRows[0].towers,
      storageUnits: projectsRows[0].storageUnits,
      socioeconomicLevel: projectsRows[0].socioeconomicLevel,
      floorNumber: projectsRows[0].floorNumber,
      yearBuilt: projectsRows[0].yearBuilt,
      customizationOptions: projectsRows[0].customizationOptions,
      terrace: projectsRows[0].terrace,
      balcony: projectsRows[0].balcony,
      garden: projectsRows[0].garden,
      laundryArea: projectsRows[0].laundryArea,
      complexName: projectsRows[0].complexName,
      shortDescription: projectsRows[0].shortDescription,
      detailedDescription: projectsRows[0].detailedDescription,
      address: projectsRows[0].address,
      latitude: Number(projectsRows[0].latitude),
      longitude: Number(projectsRows[0].longitude),
      availableDate: projectsRows[0].availableDate
        ? new Date(projectsRows[0].availableDate)
        : undefined,
      propertyType: {
        id: projectsRows[0].propertyTypeId,
        name: projectsRows[0].propertyTypeName,
      },
      projectType: {
        id: projectsRows[0].projectTypeId,
        name: projectsRows[0].projectTypeName,
      },
      housingType: {
        id: projectsRows[0].housingTypeId,
        name: projectsRows[0].housingTypeName,
      },
      city: {
        id: projectsRows[0].cityId,
        name: projectsRows[0].cityName,
        departament: {
          id: projectsRows[0].departamentId,
          name: projectsRows[0].departamentName,
        },
      },
      membership: hasPermission
        ? projectsRows[0].membership
        : "Membresía Privada",
      statusProject: {
        id: projectsRows[0].statusProjectId,
        name: projectsRows[0].statusProjectName,
      },
      ownerId: projectsRows[0].ownerId,
      email: projectsRows[0].email,
      phoneNumber: projectsRows[0].phoneNumber,
      residentialProjectId: projectsRows[0].residentialProjectId,
      warehouseProjectId: projectsRows[0].warehouseProjectId,
      commonAreas: [],
      nearbyServices: [],
      projectMedia: [],
    };

    project.nearbyServices = nearbyServicesRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    project.commonAreas = commonAreasRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    project.projectMedia = projectMediaRows.map((row: any) => ({
      id: row.id,
      url: row.url,
      tag: row.tag,
      description: row.description,
      projectId: row.project,
      commonArea: row.commonAreaId,
      imageType: row.imageTypeId,
      type: row.commonAreaName ?? row.imageTypeName ?? "Sin categoría",
    }));

    const response = NextResponse.json({ project });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error al buscar el proyecto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const projectId = Number(params?.id);

    if (!projectId) {
      return NextResponse.json(
        { error: "Id del proyecto no proporcionado" },
        { status: 400 }
      );
    }

    await db.query("CALL delete_project(?, ?)", [projectId, userId]);

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
