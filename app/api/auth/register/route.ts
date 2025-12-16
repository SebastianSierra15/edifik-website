import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { registerUserController } from "@/src/modules";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerUserController(body);
    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
