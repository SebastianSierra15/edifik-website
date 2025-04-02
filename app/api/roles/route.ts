import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Role, Permission } from "@/lib/definitios";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar roles"
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
      "CALL get_roles_with_permissions(?, ?, ?)",
      [page, pageSize, searchTerm]
    );

    const [rolesRows = [], [totalEntriesRow] = [], permissionRows = []] =
      result;

    const totalEntries = totalEntriesRow.totalEntries || 0;

    const permissionsByRole = permissionRows.reduce(
      (acc: Record<number, Permission[]>, row: any) => {
        if (!acc[row.id_role]) {
          acc[row.id_role] = [];
        }
        acc[row.id_role].push({
          id: row.id_permission,
          name: row.name_permission,
        });
        return acc;
      },
      {}
    );

    const roles: Role[] = rolesRows.map(({ id, name }: any) => ({
      id,
      name,
      permissions: permissionsByRole[id] || [],
    }));

    const response = NextResponse.json({
      roles,
      totalEntries,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error al recuperar los roles" },
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
    (perm) => perm.name === "Gestionar roles"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const { id, name, permission } = await req.json();

    if (!id || !name || !permission) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const permissionsJson = JSON.stringify(permission);

    await db.query("CALL update_role(?, ?, ?, ?)", [
      id,
      name,
      permissionsJson,
      userId,
    ]);

    const response = NextResponse.json({
      message: "Rol actualizado exitosamente",
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    return NextResponse.json(
      { error: "Error al actualizar el rol" },
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
    (perm) => perm.name === "Gestionar roles"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const { name, permission } = await req.json();

    if (!name || !permission) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const permissionsJson = JSON.stringify(permission);

    const result = await db.query("CALL create_role(?, ?, ?)", [
      name,
      permissionsJson,
      userId,
    ]);

    const response = NextResponse.json({
      message: "Rol creado exitosamente",
      result,
    });

    return response;
  } catch (error) {
    console.error("Error al crear el rol:", error);
    return NextResponse.json(
      { error: "Error al crear el rol" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar roles"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "El ID del rol es obligatorio" },
        { status: 400 }
      );
    }

    await db.query("CALL delete_role(?, ?)", [id, userId]);

    const response = NextResponse.json({
      message: "Rol eliminado exitosamente",
    });

    return response;
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    return NextResponse.json(
      { error: "Error al eliminar el rol" },
      { status: 500 }
    );
  }
}
