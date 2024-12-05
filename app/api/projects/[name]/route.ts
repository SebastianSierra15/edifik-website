import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Project, ProjectSummary } from "@/lib/definitios";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const name = params.name.replace(/-/g, " ");

    const [result] = await db.query("CALL get_project_by_name(?)", [name]);
    const rows = (result as any[][])[0];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    const project: Project = {
      id: rows[0].id,
      name: rows[0].name,
      state: rows[0].state,
      price: rows[0].price,
      totalArea: rows[0].totalArea,
      builtArea: rows[0].builtArea,
      freeHeight: rows[0].freeHeight,
      width: rows[0].width,
      length: rows[0].length,
      parkingSpots: rows[0].parkingSpots,
      elevators: rows[0].elevators,
      heavyParking: rows[0].heavyParking,
      availableUnits: rows[0].availableUnits,
      bathrooms: rows[0].bathrooms,
      bedrooms: rows[0].bedrooms,
      lobbies: rows[0].lobbies,
      towers: rows[0].towers,
      storageUnits: rows[0].storageUnits,
      customizationOptions: rows[0].customizationOptions,
      terrace: rows[0].terrace,
      balcony: rows[0].balcony,
      garden: rows[0].garden,
      laundryArea: rows[0].laundryArea,
      shortDescription: rows[0].shortDescription,
      detailedDescription: rows[0].detailedDescription,
      address: rows[0].address,
      latitude: rows[0].latitude,
      longitude: rows[0].longitude,
      availableDate: rows[0].availableDate
        ? new Date(rows[0].availableDate)
        : undefined,
      propertyType: {
        id: rows[0].propertyTypeId,
        name: rows[0].propertyTypeName,
      },
      housingType: {
        id: rows[0].housingTypeId,
        name: rows[0].housingTypeName,
      },
      city: {
        id: rows[0].cityId,
        name: rows[0].cityName,
        departament: {
          id: rows[0].departamentId,
          name: rows[0].departamentName,
        },
      },
      membership: rows[0].membership,
      commonAreas: [],
      nearbyServices: [],
      projectMedia: [],
    };

    const nearbyServicesRows = (result as any[][])[1];
    project.nearbyServices = nearbyServicesRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const commonAreasRows = (result as any[][])[2];
    project.commonAreas = commonAreasRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const projectMediaRows = (result as any[][])[3];
    project.projectMedia = projectMediaRows.map((row: any) => ({
      id: row.id,
      url: row.url,
      tag: row.tag,
      description: row.description,
      projectId: row.project,
      commonArea: row.commonArea,
      imageType: row.imageType,
    }));

    const [recommendedResult] = await db.query(
      "CALL get_recommended_projects(1000, ?, 10, 5, 3, 2)",
      [project.propertyType.id]
    );

    const recommendedRows = (recommendedResult as RowDataPacket[][])[0] || [];
    const recommendedProjectMediaRows =
      (recommendedResult as RowDataPacket[][])[1] || [];

    let projectRecommended: ProjectSummary[] = [];

    if (recommendedRows.length > 0) {
      const projectMediaMap: Record<
        number,
        { url: string; tag: string; projectId: number }[]
      > = {};
      recommendedProjectMediaRows.forEach((media: any) => {
        if (!projectMediaMap[media.projectId]) {
          projectMediaMap[media.projectId] = [];
        }
        projectMediaMap[media.projectId].push({
          url: media.url,
          tag: media.tag,
          projectId: media.projectId,
        });
      });

      projectRecommended = recommendedRows.map((row: any) => ({
        id: row.id,
        name: row.name,
        price: row.price,
        totalArea: row.area,
        address: row.address,
        longitude: row.longitude,
        latitude: row.latitude,
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
    }

    return NextResponse.json({ project, projectRecommended });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al buscar el proyecto" },
      { status: 500 }
    );
  }
}
