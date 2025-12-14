import { UpdateMembershipUseCase } from "./application/UpdateMembership";
import { MysqlMembershipRepository } from "./infrastructure/MysqlMembershipRepository";

const repository = new MysqlMembershipRepository();

export const updateMembershipUseCase = new UpdateMembershipUseCase(repository);
