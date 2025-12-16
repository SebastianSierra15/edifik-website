import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { requireAuth, requirePermission, Permission } from "@/src/modules/auth";
import { uploadImageController, deleteImageController } from "@/src/modules/s3";

export async function POST(req: Request) {
  try {
    await requirePermission(
      Permission.ManageUsers,
      Permission.ManageProjects,
      Permission.ManageOwnProperties
    );

    await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file");
    const path = formData.get("path");

    const result = await uploadImageController({
      file,
      path,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    await requirePermission(
      Permission.ManageUsers,
      Permission.ManageProjects,
      Permission.ManageOwnProperties
    );

    await requireAuth();

    const body = await req.json();

    const result = await deleteImageController(body);

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
