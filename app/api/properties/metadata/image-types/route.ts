import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ImageType } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query("CALL get_image_types()");
    const rows = (result as RowDataPacket[][])[0];

    const ImageTypes: ImageType[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      maxImagesAllowed: row.maxImagesAllowed,
      isRequired: row.isRequired,
    }));

    return NextResponse.json(ImageTypes);
  } catch (error) {
    console.error("Error en la búsqueda de tipos de imagenes: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los tipos de imagenes" },
      { status: 500 }
    );
  }
}
