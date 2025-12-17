import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { getProjectsMetadataController } from "@/src/modules/projects";

export async function GET() {
  try {
    const metadata = await getProjectsMetadataController();
    return NextResponse.json(metadata);
  } catch (error) {
    return handleHttpError(error);
  }
}
