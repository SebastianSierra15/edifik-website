import { MembershipRepository } from "../domain/MembershipRepository";
import { UpdateMembershipDTO } from "./dto/UpdateMembershipDTO";

export class UpdateMembershipUseCase {
  constructor(private readonly repository: MembershipRepository) {}

  async execute(dto: UpdateMembershipDTO): Promise<{ success: true }> {
    await this.repository.update(dto);
    return { success: true };
  }
}
