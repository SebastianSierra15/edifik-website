import { UpdateMembership } from "../application/UpdateMembership";
import { MysqlUpdateMembershipRepository } from "../infrastructure/MysqlUpdateMembershipRepository";

export async function updateMembershipController(input: {
  id: number;
  name: string;
  benefits: string;
  price: number;
  maxProjects: number;
  updatedBy: number;
  discountThreeMonths?: number | null;
  discountSixMonths?: number | null;
  discountTwelveMonths?: number | null;
  projectsFeatured?: number | null;
}) {
  return new UpdateMembership(new MysqlUpdateMembershipRepository()).execute(
    input
  );
}
