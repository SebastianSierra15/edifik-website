import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requireAuthWithPermissions,
  requirePermission,
  Permission as PermissionEnum,
} from "@/src/modules/auth";
import {
  getRolesController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from "@/src/modules/roles";

export async function GET(req: Request) {
  try {
    await requirePermission(PermissionEnum.ManageRoles);

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const searchTerm = searchParams.get("searchTerm");

    const result = await getRolesController({
      page,
      pageSize,
      searchTerm,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuthWithPermissions([
      PermissionEnum.ManageRoles,
    ]);

    const body = await req.json();

    return NextResponse.json(
      await createRoleController({
        ...body,
        userId: Number(session.user.id),
      })
    );
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuthWithPermissions([
      PermissionEnum.ManageRoles,
    ]);

    const body = await req.json();

    return NextResponse.json(
      await updateRoleController({
        ...body,
        userId: Number(session.user.id),
      })
    );
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAuthWithPermissions([
      PermissionEnum.ManageRoles,
    ]);

    const body = await req.json();

    return NextResponse.json(
      await deleteRoleController({
        ...body,
        userId: Number(session.user.id),
      })
    );
  } catch (error) {
    return handleHttpError(error);
  }
}
