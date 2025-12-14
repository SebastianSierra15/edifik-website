import { NextRequest } from "next/server";
import { MembershipsController } from "@/src/modules";
import {
  requireAuth,
  requirePermission,
  Permission,
  handleHttpError,
} from "@/src/shared";

export async function PUT(req: NextRequest) {
  try {
    await requireAuth();
    await requirePermission(Permission.ManageMemberships);

    return MembershipsController.update(req);
  } catch (error) {
    return handleHttpError(error);
  }
}
