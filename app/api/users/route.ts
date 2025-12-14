import { NextResponse } from "next/server";
import { requirePermission, Permission, handleHttpError } from "@/src/shared";
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
    await requirePermission(Permission.ManageUsers);

    const body = await req.json();
    const result = await updateUserController(body);

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission(Permission.ManageUsers);

    const body = await req.json();
    const result = await createUserController(body);

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
