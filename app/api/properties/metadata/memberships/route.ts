import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Membership } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchTerm = searchParams.get("searchTerm") || null;

  try {
    const [result] = await db.query("CALL get_memberships(?, ?, ?)", [
      page,
      pageSize,
      searchTerm,
    ]);

    const rows = (result as RowDataPacket[][])[0];
    const totalEntriesRow = (result as RowDataPacket[][])[1][0];
    const totalEntries = totalEntriesRow.totalEntries;

    const memberships: Membership[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      benefits: row.benefits,
      price: row.price,
      discountThreeMonths: row.discount_three_months,
      discountSixMonths: row.discount_six_months,
      discountTwelveMonths: row.discount_twelve_months,
      maxProperties: row.max_properties,
      maxImagesProperty: row.max_images_property,
      propertiesFeatured: row.properties_featured,
    }));

    return NextResponse.json({ memberships, totalEntries });
  } catch (error) {
    console.error("Error en la búsqueda de membresías: ", error);
    return NextResponse.json(
      { error: "Error al recuperar las membresías" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      name,
      benefits,
      price,
      discountThreeMonths,
      discountSixMonths,
      discountTwelveMonths,
      maxProperties,
      maxImagesProperty,
      propertiesFeatured,
    } = await request.json();

    if (
      !id ||
      !name ||
      !price ||
      !benefits ||
      !discountThreeMonths ||
      !discountSixMonths ||
      !discountTwelveMonths ||
      !maxProperties ||
      !maxImagesProperty
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "CALL update_membership(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        name,
        benefits,
        price,
        discountThreeMonths,
        discountSixMonths,
        discountTwelveMonths,
        maxProperties,
        maxImagesProperty,
        propertiesFeatured,
      ]
    );

    return NextResponse.json({
      message: "Membresía actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la membresía: ", error);
    return NextResponse.json(
      { error: "Error al actualizar la membresía" },
      { status: 500 }
    );
  }
}
