import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requirePermission,
  Permission as PermissionEnum,
} from "@/src/modules/auth";
import { getPermissionsController } from "@/src/modules/roles";

export async function GET() {
  try {
    await requirePermission(PermissionEnum.ManageRoles);

    const permissions = await getPermissionsController();

    return NextResponse.json({ permissions });
  } catch (error) {
    return handleHttpError(error);
  }
}
