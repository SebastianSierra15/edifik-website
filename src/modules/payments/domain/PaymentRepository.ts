import { Payment } from "./Payment";
import { PaymentStatus } from "./PaymentStatus";

export interface PaymentRepository {
  findByIdempotencyKey(key: string): Promise<Payment | null>;
  create(payment: Omit<Payment, "id" | "createdAt">): Promise<Payment>;
  updateStatus(id: number, status: PaymentStatus): Promise<void>;
}
