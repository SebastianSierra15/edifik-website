import { BadRequestError } from "@/src/shared";
import { PaymentRepository } from "../domain/PaymentRepository";
import { PaymentStatus } from "../domain/PaymentStatus";

interface CreatePaymentInput {
  userId: number;
  amount: number;
  currency: string;
  idempotencyKey: string;
}

export class CreatePayment {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(input: CreatePaymentInput) {
    const { userId, amount, currency, idempotencyKey } = input;

    if (!userId || !amount || !currency || !idempotencyKey) {
      throw new BadRequestError("Datos de pago incompletos");
    }

    const existing = await this.repository.findByIdempotencyKey(idempotencyKey);

    if (existing) {
      return { paymentId: existing.id, status: existing.status };
    }

    const payment = await this.repository.create({
      userId,
      amount,
      currency,
      status: PaymentStatus.Pending,
      providerRef: "",
      idempotencyKey,
    });

    return { paymentId: payment.id, status: payment.status };
  }
}
