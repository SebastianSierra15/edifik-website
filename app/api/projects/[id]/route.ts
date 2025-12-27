import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
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
    await requireAuthWithPermissions([
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties,
    ]);

    const canSeeMembership = true;

    const { searchParams } = new URL(req.url);

    const { id } = await params;
    const result = await getProjectByIdController({
      projectId: Number(id),
      isProject: Number(searchParams.get("isProject")),
      isAdmin: Number(searchParams.get("isAdmin") ?? 0),
      canSeeMembership,
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
