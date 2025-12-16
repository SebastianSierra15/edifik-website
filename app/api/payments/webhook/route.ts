import { NextRequest, NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { paymentWebhookController } from "@/src/modules/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await paymentWebhookController(body);
    return NextResponse.json({ received: true });
  } catch (error) {
    return handleHttpError(error);
  }
}
