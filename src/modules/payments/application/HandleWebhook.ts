import { PaymentRepository } from "../domain/PaymentRepository";
import { PaymentStatus } from "../domain/PaymentStatus";

interface WebhookInput {
  idempotencyKey: string;
  approved: boolean;
}

export class HandlePaymentWebhook {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(input: WebhookInput): Promise<void> {
    if (!input?.idempotencyKey) return;

    const payment = await this.repository.findByIdempotencyKey(
      input.idempotencyKey
    );

    if (!payment) return;

    const newStatus = input.approved
      ? PaymentStatus.Approved
      : PaymentStatus.Rejected;

    await this.repository.updateStatus(payment.id, newStatus);
  }
}
