import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  City,
  HousingType,
  PropertyType,
  NearbyService,
  CommonArea,
  MembershipSummary,
} from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

function mapResults<T>(
  result: RowDataPacket[] | undefined,
  mapper: (row: any) => T
): T[] {
  if (!result) return [];
  return result.map(mapper);
}

export async function GET() {
  try {
    // Llamada al procedimiento almacenado 'get_metadata'
    const [result] = await db.query<RowDataPacket[][]>("CALL get_metadata()");

    if (!result || result.length < 6) {
      throw new Error("No se obtuvieron todos los resultados esperados.");
    }

    const [
      citiesResult,
      commonAreasResult,
      housingTypesResult,
      nearbyServicesResult,
      propertyTypesResult,
      membershipsResult,
    ] = result;

    const cities: City[] = mapResults(citiesResult, (row) => ({
      id: row.cityId,
      name: row.cityName,
      departament: {
        id: row.departamentId,
        name: row.departamentName,
      },
    }));

    const commonAreas: CommonArea[] = mapResults(commonAreasResult, (row) => ({
      id: row.commonAreaId,
      name: row.commonAreaName,
    }));

    const housingTypes: HousingType[] = mapResults(
      housingTypesResult,
      (row) => ({
        id: row.housingTypeId,
        name: row.housingTypeName,
      })
    );

    const nearbyServices: NearbyService[] = mapResults(
      nearbyServicesResult,
      (row) => ({
        id: row.nearbyServiceId,
        name: row.nearbyServiceName,
      })
    );

    const propertyTypes: PropertyType[] = mapResults(
      propertyTypesResult,
      (row) => ({
        id: row.propertyTypeId,
        name: row.propertyTypeName,
      })
    );

    const memberships: MembershipSummary[] = mapResults(
      membershipsResult,
      (row) => ({
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
