import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  HousingType,
  propertyType,
  NearbyService,
  CommonArea,
  Category,
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
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_basic_metadata()"
    );

    if (!result || result.length < 5) {
      throw new Error("No se obtuvieron todos los resultados esperados.");
    }

    const [
      commonAreasResult,
      housingTypesResult,
      nearbyServicesResult,
      propertyTypesResult,
    ] = result;

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

    const propertyTypes: propertyType[] = mapResults(
      propertyTypesResult,
      (row) => ({
        id: row.propertyTypeId,
        name: row.propertyTypeName,
      })
    );

    return NextResponse.json({
      commonAreas,
      housingTypes,
      nearbyServices,
      propertyTypes,
    });
  } catch (error) {
    console.error("Error en la búsqueda de los datos: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 }
    );
  }
}
