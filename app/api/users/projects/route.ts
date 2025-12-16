import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { requirePermission, Permission } from "@/src/modules/auth";
import { getUsersProjectsController } from "@/src/modules/users";

export async function GET(req: Request) {
  try {
    await requirePermission(Permission.ManageUsers);

    const { searchParams } = new URL(req.url);

    const userId = Number(searchParams.get("userId"));
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);

    const result = await getUsersProjectsController({
      userId,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
