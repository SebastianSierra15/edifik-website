import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requirePermission,
  Permission,
  getUsersMetadataController,
} from "@/src/modules";

export async function GET() {
  try {
    await requirePermission(Permission.ManageUsers);

    const metadata = await getUsersMetadataController();
    return NextResponse.json(metadata);
  } catch (error) {
    return handleHttpError(error);
  }
}
