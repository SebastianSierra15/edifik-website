import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { PropertySummary, CommonArea, NearbyService } from "@/lib/definitios";

const formatDateForMySQL = (date: any) => {
  if (!date) return null;
  const validDate = date instanceof Date ? date : new Date(date);
  if (isNaN(validDate.getTime())) {
    throw new Error("Fecha inválida proporcionada");
  }
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const day = String(validDate.getDate()).padStart(2, "0");

  console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const getQueryParam = (paramName: string): string | null => {
      const value = url.searchParams.get(paramName);
      return value !== null && value.trim() !== "" ? value : null;
    };

    const page = parseInt(getQueryParam("page") || "1", 10);
    const pageSize = parseInt(getQueryParam("pageSize") || "16", 10);
    const cities = getQueryParam("cities");
    const propertyTypes = getQueryParam("propertyTypes");
    const housingTypes = getQueryParam("housingTypes");
    const memberships = getQueryParam("memberships");
    const price = getQueryParam("price");
    const area = getQueryParam("area");
    const rooms = getQueryParam("rooms");
    const bathrooms = getQueryParam("bathrooms");
    const lobbies = getQueryParam("lobbies");
    const commonAreas = getQueryParam("commonAreas");
    const nearbyServices = getQueryParam("nearbyServices");
    const searchTerm = getQueryParam("searchTerm");

    const validatedPage = !isNaN(page) && page > 0 ? page : 1;
    const validatedPageSize = !isNaN(pageSize) && pageSize > 0 ? pageSize : 15;

    const [result] = await db.query(
      "CALL get_properties(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        validatedPage,
        validatedPageSize,
        cities,
        propertyTypes,
        housingTypes,
        memberships,
        price,
        area,
        rooms,
        bathrooms,
        lobbies,
        commonAreas,
        nearbyServices,
        searchTerm,
      ]
    );

    const rows = (result as RowDataPacket[][])[0];
    const totalEntriesRow = (result as RowDataPacket[][])[1][0];
    const totalEntries = totalEntriesRow.totalEntries;

    if (rows.length === 0) {
      return NextResponse.json({ properties: [], totalEntries: 0 });
    }

    const properties: PropertySummary[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      totalArea: row.area,
      longitude: row.longitude,
      latitude: row.latitude,
      address: row.address,
      city: {
        id: row.cityId,
        name: row.city,
        departament: {
          id: row.departamentId,
          name: row.departament,
        },
      },
      membership: row.membership,
    }));

    return NextResponse.json({ properties, totalEntries });
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
    const propertyData = await request.json();

    const {
      name,
      state,
      price,
      builtArea,
      totalArea,
      bathrooms,
      rooms,
      lobbies,
      shortDescription,
      detailedDescription,
      address,
      latitude,
      longitude,
      availabeDate,
      isCompanyOwned,
      category,
      propertyType,
      housingType,
      city,
      membership,
      commonAreas,
      nearbyServices,
    } = propertyData;
    
    if (
      !name ||
      !price ||
      !builtArea ||
      !totalArea ||
      !shortDescription ||
      !address ||
      !latitude ||
      !longitude ||
      !category?.id ||
      !propertyType?.id ||
      !housingType?.id ||
      !city?.name ||
      !city?.departament?.name
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para actualizar la propiedad." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "CALL create_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        state || true,
        price,
        builtArea,
        totalArea,
        rooms || 0,
        bathrooms || 0,
        lobbies || 0,
        shortDescription,
        detailedDescription || null,
        address,
        latitude,
        longitude,
        formatDateForMySQL(availabeDate),
        isCompanyOwned || 0,
        category.id,
        city.name,
        city.departament.name,
        housingType.id,
        membership || 1004,
        propertyType.id,
      ]
    );

    const propertyIdRow = (result as RowDataPacket[][])[0][0];
    const propertyId = propertyIdRow.propertyId;

    if (!propertyId) {
      throw new Error("No se pudo crear la propiedad.");
    }

    if (Array.isArray(commonAreas) && commonAreas.length > 0) {
      console.log("Adding common areas...");
      await Promise.all(
        commonAreas.map((area: CommonArea) =>
          db.query("CALL add_common_area(?, ?)", [propertyId, area.id])
        )
      );
    }

    if (Array.isArray(nearbyServices) && nearbyServices.length > 0) {
      console.log("Adding nearby services...");
      await Promise.all(
        nearbyServices.map((service: NearbyService) =>
          db.query("CALL add_nearby_service(?, ?)", [propertyId, service.id])
        )
      );
    }

    return NextResponse.json({
      message: "Propiedad creada correctamente.",
      propertyId,
    });
  } catch (error) {
    console.error("Error al crear la propiedad:", error);
    return NextResponse.json(
      { error: "Error al crear la propiedad." },
      { status: 500 }
    );
  }
}
