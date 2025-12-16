import { PaymentRepository } from "../domain/PaymentRepository";
import { PaymentStatus } from "../domain/PaymentStatus";
import { Payment } from "../domain/Payment";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class MysqlPaymentRepository implements PaymentRepository {
  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM payments WHERE idempotency_key = ? LIMIT 1",
      [key]
    );

    if (!rows.length) return null;

    const row = rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      providerRef: row.provider_ref,
      idempotencyKey: row.idempotency_key,
      createdAt: row.created_at,
    };
  }

  async create(payment: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const [result] = await db.query<ResultSetHeader>(
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

    return {
      ...payment,
      id: result.insertId,
      createdAt: new Date(),
    };
  }

  async updateStatus(id: number, status: PaymentStatus): Promise<void> {
    await db.query("UPDATE payments SET status = ? WHERE id = ?", [status, id]);
  }
}
