import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { requireAuth } from "@/src/modules";
import {
  sendRecoveryCodeController,
  changePasswordController,
} from "@/src/modules/password";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const result = await sendRecoveryCodeController(email);
    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuth();
    const { currentPassword, newPassword } = await req.json();

    const result = await changePasswordController({
      userId: Number(session.user.id),
      currentPassword,
      newPassword,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
