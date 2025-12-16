import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { searchPropertiesController } from "@/src/modules";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await searchPropertiesController({
      page: Math.max(Number(searchParams.get("page") ?? 1), 1),
      pageSize: Math.max(Number(searchParams.get("pageSize") ?? 16), 1),

      cities: searchParams.get("cities"),
      propertyTypes: searchParams.get("propertyTypes"),
      housingTypes: searchParams.get("housingTypes"),
      commonAreas: searchParams.get("commonAreas"),
      nearbyServices: searchParams.get("nearbyServices"),

      price: searchParams.get("price")
        ? Number(searchParams.get("price"))
        : null,

      area: searchParams.get("area"),
      bedrooms: searchParams.get("bedrooms"),
      bathrooms: searchParams.get("bathrooms"),
      lobbies: searchParams.get("lobbies"),

      projectTypeId: Number(searchParams.get("projectTypeId") ?? 2),

      minLat: searchParams.get("minLat")
        ? Number(searchParams.get("minLat"))
        : null,
      maxLat: searchParams.get("maxLat")
        ? Number(searchParams.get("maxLat"))
        : null,
      minLng: searchParams.get("minLng")
        ? Number(searchParams.get("minLng"))
        : null,
      maxLng: searchParams.get("maxLng")
        ? Number(searchParams.get("maxLng"))
        : null,

      latitude: searchParams.get("latitude")
        ? Number(searchParams.get("latitude"))
        : null,
      longitude: searchParams.get("longitude")
        ? Number(searchParams.get("longitude"))
        : null,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
