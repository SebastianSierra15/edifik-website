import { MysqlPaymentRepository } from "./infrastructure/MysqlPaymentRepository";
import { CreatePaymentUseCase } from "./application/CreatePayment";
import { HandleWebhookUseCase } from "./application/HandleWebhook";

const repository = new MysqlPaymentRepository();

export const createPaymentUseCase = new CreatePaymentUseCase(repository);
export const handleWebhookUseCase = new HandleWebhookUseCase(repository);
