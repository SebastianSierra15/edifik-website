import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requireAuthWithPermissions,
  requirePermission,
  Permission,
} from "@/src/modules/auth";
import {
  getUsersController,
  updateUserController,
  createUserController,
} from "@/src/modules/users";

export async function GET(req: Request) {
  try {
    await requirePermission(Permission.ManageUsers);

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const searchTerm = searchParams.get("searchTerm");

    const result = await getUsersController({
      page,
      pageSize,
      searchTerm,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuthWithPermissions(
      [Permission.ManageUsers],
      { missingSessionError: "forbidden" }
    );
    const body = await req.json();

    const result = await updateUserController({
      ...body,
      updatedBy: session.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuthWithPermissions(
      [Permission.ManageUsers],
      { missingSessionError: "forbidden" }
    );
    const body = await req.json();

    const result = await createUserController({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
