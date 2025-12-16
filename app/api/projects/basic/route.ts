import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { getPublicProjectsController } from "@/src/modules";

export async function GET() {
  try {
    const result = await getPublicProjectsController();
    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
