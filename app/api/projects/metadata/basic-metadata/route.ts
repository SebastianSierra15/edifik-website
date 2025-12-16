import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requirePermission,
  Permission,
  getProjectsBasicMetadataController,
} from "@/src/modules";

export async function GET() {
  try {
    await requirePermission(
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties
    );

    const metadata = await getProjectsBasicMetadataController();
    return NextResponse.json(metadata);
  } catch (error) {
    return handleHttpError(error);
  }
}
