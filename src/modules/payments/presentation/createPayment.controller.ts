import { CreatePayment } from "../application/CreatePayment";
import { MysqlPaymentRepository } from "../infrastructure/MysqlPaymentRepository";

export async function createPaymentController(input: {
  userId: number;
  amount: number;
  currency: string;
  idempotencyKey: string;
}) {
  const useCase = new CreatePayment(new MysqlPaymentRepository());

  return useCase.execute(input);
}
