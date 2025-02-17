import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { User } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar usuarios"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchTerm = escapeSearchTerm(searchParams.get("searchTerm") || null);

  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_users(?, ?, ?)",
      [page, pageSize, searchTerm]
    );

    const [userRows = [], [totalEntriesRow] = []] = result;

    const totalEntries = totalEntriesRow.totalEntries || 0;

    const users: User[] = userRows.map((row: any) => ({
      id: row.id,
      username: row.username,
      names: row.names,
      lastnames: row.lastnames,
      email: row.email,
      phoneNumber: row.phoneNumber,
      gender: {
        id: row.genderId,
        name: row.genderName,
      },
      state: row.state,
      registrationDate: row.registrationDate,
      lastLogin: row.lastLogin,
      role: {
        id: row.roleId,
        name: row.roleName,
      },
      membership: {
        id: row.membershipId,
        name: row.membershipName,
      },
      totalProperties: row.totalProperties,
      provider: row.providerName,
    }));

    return NextResponse.json({
      users,
      totalEntries,
    });
  } catch (error) {
    console.error("Error al recuperar los usuarios:", error);
    return NextResponse.json(
      { error: "Error al recuperar los usuarios" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar usuarios"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const {
      id,
      username,
      names,
      lastnames,
      email,
      phoneNumber,
      gender,
      role,
      membership,
      state,
    } = await req.json();

    if (
      !id ||
      !username ||
      !names ||
      !lastnames ||
      !email ||
      !gender ||
      !role
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    await db.query("CALL update_user_admin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      id,
      username,
      names,
      lastnames,
      email,
      phoneNumber || null,
      state || false,
      gender.id,
      role.id,
      membership.id || "1001",
      userId,
    ]);

    return NextResponse.json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar usuarios"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const {
      username,
      names,
      lastnames,
      email,
      phoneNumber,
      gender,
      role,
      membership,
      state,
    } = await req.json();

    if (!username || !names || !lastnames || !email || !gender || !role) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    await db.query("CALL insert_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      username,
      names,
      lastnames,
      email,
      phoneNumber || null,
      gender.id,
      role.id,
      membership.id || "1001",
      state || false,
      userId,
    ]);

    return NextResponse.json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
