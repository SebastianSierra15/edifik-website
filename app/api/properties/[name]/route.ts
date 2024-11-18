import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Property } from "@/lib/definitios";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;

    const [result] = await db.query("CALL get_property_by_name(?)", [name]);
    const rows = (result as any[][])[0];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    const property: Property = {
      id: rows[0].id,
      name: rows[0].name,
      state: rows[0].state,
      price: rows[0].price,
      builtArea: rows[0].builtArea,
      totalArea: rows[0].totalArea,
      bathrooms: rows[0].bathrooms,
      rooms: rows[0].rooms,
      lobbies: rows[0].lobbies,
      shortDescription: rows[0].shortDescription,
      detailedDescription: rows[0].detailedDescription || null,
      address: rows[0].address,
      latitude: rows[0].latitude,
      longitude: rows[0].longitude,
      availabeDate: rows[0].availabeDate
        ? new Date(rows[0].availabeDate)
        : null,
      isCompanyOwned: rows[0].isCompanyOwned,
      category: {
        id: rows[0].categoryId,
        name: rows[0].categoryName,
      },
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
      nearbyService: [],
      propertyMedia: [],
    };

    const nearbyServicesRows = (result as any[][])[1];
    property.nearbyService = nearbyServicesRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const commonAreasRows = (result as any[][])[2];
    property.commonAreas = commonAreasRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const propertyMediaRows = (result as any[][])[3];
    property.propertyMedia = propertyMediaRows.map((row: any) => ({
      id: row.id,
      url: row.url,
      propertyId: row.property,
      commonArea: row.commonArea,
      imageType: row.imageType,
    }));

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error al buscar la propiedad:", error);
    return NextResponse.json(
      { error: "Error al buscar la propiedad" },
      { status: 500 }
    );
  }
}
