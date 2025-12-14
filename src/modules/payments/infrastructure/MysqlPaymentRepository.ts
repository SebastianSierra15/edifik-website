import { PaymentRepository } from "../domain/PaymentRepository";
import { PaymentStatus } from "../domain/PaymentStatus";
import { db } from "@/lib/db";

export class MysqlPaymentRepository implements PaymentRepository {
  async findByIdempotencyKey(key: string) {
    const [rows]: any = await db.query(
      "SELECT * FROM payments WHERE idempotency_key = ? LIMIT 1",
      [key]
    );
    return rows[0] ?? null;
  }

  async create(payment: any) {
    const [result]: any = await db.query(
      `INSERT INTO payments 
      (user_id, amount, currency, status, provider_ref, idempotency_key)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payment.userId,
        payment.amount,
        payment.currency,
        payment.status,
        payment.providerRef,
        payment.idempotencyKey,
      ]
    );

    return { ...payment, id: result.insertId, createdAt: new Date() };
  }

  async updateStatus(id: number, status: PaymentStatus): Promise<void> {
    await db.query("UPDATE payments SET status = ? WHERE id = ?", [status, id]);
  }
}
