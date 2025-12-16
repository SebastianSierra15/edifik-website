import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { checkUserEmailController } from "@/src/modules";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") ?? "";

    const result = await checkUserEmailController(email);

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
