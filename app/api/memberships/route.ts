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
    const totalEntries = (result as RowDataPacket[][])[1][0].totalEntries - 1;

    const memberships = rows as Membership[];

    return NextResponse.json({ memberships, totalEntries });
  } catch (error) {
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
      maxProjects,
      projectsFeatured,
    } = await request.json();

    if (
      id === undefined ||
      name === undefined ||
      benefits === undefined ||
      price === undefined ||
      maxProjects === undefined
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    await db.query("CALL update_membership(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      id,
      name,
      benefits,
      price,
      discountThreeMonths,
      discountSixMonths,
      discountTwelveMonths,
      maxProjects,
      projectsFeatured,
    ]);

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
