import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requireAuth,
  requirePermission,
  Permission,
  getProjectOwnerController,
} from "@/src/modules";

export async function GET(req: Request) {
  try {
    await requirePermission(
      Permission.ManageProjects,
      Permission.ManageProperties
    );

    await requireAuth();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const result = await getProjectOwnerController({ email });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
