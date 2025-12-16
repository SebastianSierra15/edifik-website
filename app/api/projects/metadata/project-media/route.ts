import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requirePermission,
  Permission,
  createProjectMediaController,
  updateProjectMediaController,
  deleteProjectMediaController,
} from "@/src/modules";

export async function POST(req: Request) {
  try {
    await requirePermission(
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties
    );

    const { projectMedia } = await req.json();
    await createProjectMediaController(projectMedia);

    return NextResponse.json({
      message: "Medios insertados correctamente.",
    });
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    await requirePermission(
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties
    );

    const { projectMedia } = await req.json();
    await updateProjectMediaController(projectMedia);

    return NextResponse.json({
      message: "Medios actualizados correctamente.",
    });
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    await requirePermission(
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties
    );

    const { mediaIds } = await req.json();
    await deleteProjectMediaController(mediaIds);

    return NextResponse.json({
      message: "Medios eliminados correctamente.",
    });
  } catch (error) {
    return handleHttpError(error);
  }
}
