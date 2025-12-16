import { NextResponse } from "next/server";
import { handleHttpError, BadRequestError } from "@/src/shared";
import {
  requireAuth,
  getUserProfileController,
  updateUserProfileController,
} from "@/src/modules";

export async function GET() {
  try {
    const session = await requireAuth();

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestError("Usuario inválido");
    }

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

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestError("Usuario inválido");
    }

    const body = await req.json();

    await updateUserProfileController(userId, body);

    return NextResponse.json(
      { message: "Perfil actualizado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return handleHttpError(error);
  }
}
