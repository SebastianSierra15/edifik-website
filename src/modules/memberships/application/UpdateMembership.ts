import { BadRequestError } from "@/src/shared";
import { UpdateMembershipRepository } from "../domain/MembershipRepository";

export class UpdateMembership {
  constructor(private readonly repo: UpdateMembershipRepository) {}

  async execute(input: {
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
    const { id, name, benefits, price, maxProjects } = input;

    if (!id || !name || !benefits || price == null || maxProjects == null) {
      throw new BadRequestError("Faltan datos obligatorios");
    }

    await this.repo.update(input);

    return { message: "Membresía actualizada correctamente" };
  }
}
