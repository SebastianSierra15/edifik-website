import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requirePermission,
  Permission,
  getProjectsImageTypesMetadataController,
} from "@/src/modules";

export async function GET() {
  try {
    await requirePermission(
      Permission.ManageProjects,
      Permission.ManageProperties,
      Permission.ManageOwnProperties
    );

    const imageTypes = await getProjectsImageTypesMetadataController();
    return NextResponse.json(imageTypes);
  } catch (error) {
    return handleHttpError(error);
  }
}
