import { PaymentRepository } from "../domain/PaymentRepository";
import { PaymentStatus } from "../domain/PaymentStatus";

interface CreatePaymentInput {
  userId: number;
  amount: number;
  currency: string;
  idempotencyKey: string;
}

export class CreatePaymentUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(input: CreatePaymentInput) {
    const existing = await this.repository.findByIdempotencyKey(
      input.idempotencyKey
    );

    if (existing) {
      return existing;
    }

    return this.repository.create({
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      status: PaymentStatus.Pending,
      providerRef: "",
      idempotencyKey: input.idempotencyKey,
    });
  }
}
