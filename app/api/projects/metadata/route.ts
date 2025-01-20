import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  City,
  HousingType,
  propertyType,
  NearbyService,
  CommonArea,
  MembershipSummary,
} from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query<RowDataPacket[][]>("CALL get_metadata()");

    if (!result || result.length < 6) {
      throw new Error("No se obtuvieron todos los resultados esperados.");
    }

    const [
      citiesRows = [],
      commonAreasRows = [],
      housingTypesRows = [],
      nearbyServicesRows = [],
      propertyTypesRows = [],
      membershipsRows = [],
    ] = result;

    const cities: City[] = citiesRows.map((row: any) => ({
      id: row.cityId,
      name: row.cityName,
      departament: {
        id: row.departamentId,
        name: row.departamentName,
      },
    }));

    const commonAreas: CommonArea[] = commonAreasRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const housingTypes: HousingType[] = housingTypesRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const nearbyServices: NearbyService[] = nearbyServicesRows.map(
      (row: any) => ({
        id: row.id,
        name: row.name,
      })
    );

    const propertyTypes: propertyType[] = propertyTypesRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const memberships: MembershipSummary[] = membershipsRows.map(
      (row: any) => ({
        id: row.membershipId,
        name: row.membershipName,
      })
    );

    return NextResponse.json({
      cities,
      commonAreas,
      housingTypes,
      nearbyServices,
      propertyTypes,
      memberships,
    });
  } catch (error) {
    console.error("Error al recuperar los datos:", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 }
    );
  }
}
