import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { requireAuth, requirePermission, Permission } from "@/src/modules/auth";
import {
  deleteUserProjectController,
  getUserProjectsController,
} from "@/src/modules/userProjects";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    const url = new URL(req.url);

    const page = Math.max(Number(url.searchParams.get("page") ?? 1), 1);
    const pageSize = Math.max(
      Number(url.searchParams.get("pageSize") ?? 16),
      1
    );
    const statusProject = Math.max(
      Number(url.searchParams.get("statusProject") ?? 2),
      0
    );

    const userId = Number(session.user.id);

    const result = await getUserProjectsController({
      userId,
      page,
      pageSize,
      statusProject,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAuth();

    await requirePermission(Permission.ManageOwnProperties);

    const url = new URL(req.url);
    const projectId = Number(url.searchParams.get("id"));

    const userId = Number(session.user.id);

    await deleteUserProjectController({
      userId,
      projectId,
    });

    return NextResponse.json(
      { message: "Proyecto eliminado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    return handleHttpError(error);
  }
}
