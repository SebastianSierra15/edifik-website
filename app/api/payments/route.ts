import { NextRequest, NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { createPaymentController } from "@/src/modules";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createPaymentController(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleHttpError(error);
  }
}
