import { NextRequest, NextResponse } from "next/server";
import { createPaymentUseCase, handleWebhookUseCase } from "../index";

export class PaymentsController {
  static async create(req: NextRequest) {
    const body = await req.json();
    const payment = await createPaymentUseCase.execute(body);
    return NextResponse.json(payment, { status: 201 });
  }

  static async webhook(req: NextRequest) {
    const body = await req.json();
    await handleWebhookUseCase.execute(body);
    return NextResponse.json({ received: true });
  }
}
