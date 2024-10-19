import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { PropertySummary } from "@/lib/definitios";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const getQueryParam = (paramName: string): string | null => {
      const value = url.searchParams.get(paramName);
      return value !== null && value.trim() !== "" ? value : null;
    };

    const page = parseInt(getQueryParam("page") || "1", 10);
    const pageSize = parseInt(getQueryParam("pageSize") || "15", 10);
    const categories = getQueryParam("categories");
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

    console.log({
      page: validatedPage,
      pageSize: validatedPageSize,
      categories,
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
    });

    const [result] = await db.query(
      "CALL get_properties(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        validatedPage,
        validatedPageSize,
        categories,
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
      area: row.area,
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
