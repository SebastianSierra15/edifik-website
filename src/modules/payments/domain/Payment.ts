import { PaymentStatus } from "./PaymentStatus";

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  providerRef: string;
  idempotencyKey: string;
  createdAt: Date;
}
