import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { requireAuth } from "@/src/modules/auth";
import {
  getUserProfileController,
  updateUserProfileController,
} from "@/src/modules/userProfile";

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const result = await getUserProfileController(userId);
    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuth();
    const userId = Number(session.user.id);

    const body = await req.json();
    const result = await updateUserProfileController(userId, body);

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
