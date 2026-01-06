import { HandlePaymentWebhook } from "../application/HandleWebhook";
import { MysqlPaymentRepository } from "../infrastructure/MysqlPaymentRepository";

export async function paymentWebhookController(input: {
  idempotencyKey: string;
  approved: boolean;
}) {
  const useCase = new HandlePaymentWebhook(new MysqlPaymentRepository());

  await useCase.execute(input);
}
