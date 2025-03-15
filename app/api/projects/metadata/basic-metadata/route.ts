import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  HousingType,
  propertyType,
  NearbyService,
  CommonArea,
} from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function mapResults<T>(
  result: RowDataPacket[] | undefined,
  mapper: (row: any) => T
): T[] {
  if (!result) return [];
  return result.map(mapper);
}

export async function GET() {
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_basic_metadata()"
    );

    const dbEndTime = performance.now(); // Finaliza medición de la BD

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
      id: row.id,
      name: row.name,
    }));

    const housingTypes: HousingType[] = mapResults(
      housingTypesResult,
      (row) => ({
        id: row.id,
        name: row.name,
      })
    );

    const nearbyServices: NearbyService[] = mapResults(
      nearbyServicesResult,
      (row) => ({
        id: row.id,
        name: row.name,
      })
    );

    const propertyTypes: propertyType[] = mapResults(
      propertyTypesResult,
      (row) => ({
        id: row.id,
        name: row.name,
      })
    );

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({
      commonAreas,
      housingTypes,
      nearbyServices,
      propertyTypes,
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error en la búsqueda de los datos: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 }
    );
  }
}
