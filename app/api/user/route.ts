import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { requireAuth, requirePermission, Permission } from "@/src/modules/auth";
import {
  deleteUserProjectController,
  getUserProjectsController,
} from "@/src/modules/userProjects";

export async function GET(req: Request) {
  try {
    const session = await requireAuth(); // ya existe :contentReference[oaicite:1]{index=1}

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    const statusProject = Number(url.searchParams.get("statusProject") ?? "2");

    const userId = Number(session.user.id);

    const result = await getUserProjectsController({
      userId,
      page: page > 0 ? page : 1,
      pageSize: pageSize > 0 ? pageSize : 16,
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
    await requirePermission(Permission.ManageOwnProperties); // enum ya definido :contentReference[oaicite:3]{index=3}

    const url = new URL(req.url);
    const projectId = Number(url.searchParams.get("id") ?? "0");

    const userId = Number(session.user.id);

    const result = await deleteUserProjectController({
      userId,
      projectId,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
