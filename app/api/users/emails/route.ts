import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requirePermission,
  Permission,
  searchUserEmailsController,
} from "@/src/modules";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("searchTerm") ?? "";

    await requirePermission(Permission.ManageProperties);

    const result = await searchUserEmailsController(searchTerm);

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
