import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { User, Gender } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userId = session.user?.id;

  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_profile(?)",
      [userId]
    );

    const userRow = result[0]?.[0];
    const genderRows = result[1] ?? [];

    if (!userRow) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user: User = {
      id: userRow.id,
      identityDocument: userRow.identityDocument,
      names: userRow.names,
      lastnames: userRow.lastnames,
      birthdate: userRow.birthdate ? new Date(userRow.birthdate) : undefined,
      email: userRow.email,
      phoneNumber: userRow.phoneNumber,
      gender: {
        id: userRow.genderId,
        name: userRow.genderName,
      },
      role: {} as any,
      membership: {} as any,
      provider: userRow.providerId,
    };

    const genders: Gender[] = genderRows.map((row) => ({
      id: row.genderId,
      name: row.genderName,
    }));

    return NextResponse.json({ user, genders });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userId = session.user?.id;
  const body = await req.json();

  const { identityDocument, names, lastnames, birthdate, phoneNumber, gender } =
    body;

  try {
    await db.query("CALL update_user_profile(?, ?, ?, ?, ?, ?, ?)", [
      userId,
      identityDocument,
      names,
      lastnames,
      birthdate || null,
      phoneNumber,
      (gender.id === 0 ? null : gender.id) || null,
    ]);

    return NextResponse.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
}
