import { db } from "@/lib/db";
import { UpdateMembershipRepository } from "../domain/MembershipRepository";

export class MysqlUpdateMembershipRepository
  implements UpdateMembershipRepository
{
  async update(data: any): Promise<void> {
    await db.query("CALL update_membership(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      data.id,
      data.name,
      data.benefits,
      data.price,
      data.discountThreeMonths,
      data.discountSixMonths,
      data.discountTwelveMonths,
      data.maxProjects,
      data.projectsFeatured,
      data.updatedBy,
    ]);
  }
}
