import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  getServerSession,
  requireAuthWithPermissions,
  Permission,
} from "@/src/modules/auth";
import {
  getProjectByIdController,
  deleteProjectPermanentlyController,
} from "@/src/modules/projects";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isProject = Number(searchParams.get("isProject") ?? 0);
    const session = await getServerSession();

    const permissions = session?.user?.permissions ?? [];
    const canManageAll = permissions.some(
      (perm) =>
        perm.name === Permission.ManageProjects ||
        perm.name === Permission.ManageProperties
    );
    const canManageOwn = permissions.some(
      (perm) => perm.name === Permission.ManageOwnProperties
    );

    const isAdmin = canManageAll ? 1 : 0;
    const ownerId =
      !isAdmin && canManageOwn ? Number(session?.user?.id ?? 0) : null;
    const canSeeMembership = isAdmin === 1;

    const result = await getProjectByIdController({
      projectId: Number(id),
      isProject,
      isAdmin,
      canSeeMembership,
      ownerId,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthWithPermissions([
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties,
    ]);

    const { id } = await params;
    await deleteProjectPermanentlyController(Number(id), {
      userId: Number(session.user.id),
      canManageAll: true,
    });

    return NextResponse.json({
      message: "Proyecto eliminado definitivamente",
    });
  } catch (error) {
    return handleHttpError(error);
  }
}
