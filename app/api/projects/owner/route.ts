import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requireAuthWithPermissions,
  Permission,
} from "@/src/modules/auth";
import { getProjectOwnerController } from "@/src/modules/projectsOwner";

export async function GET(req: Request) {
  try {
    await requireAuthWithPermissions(
      [Permission.ManageProjects, Permission.ManageProperties],
      { missingSessionError: "forbidden" }
    );

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const result = await getProjectOwnerController({ email });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
