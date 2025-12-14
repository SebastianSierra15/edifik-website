import { UpdateMembershipDTO } from "../application/dto/UpdateMembershipDTO";

export interface MembershipRepository {
  update(dto: UpdateMembershipDTO): Promise<void>;
}
