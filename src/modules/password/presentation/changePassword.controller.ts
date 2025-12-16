import { ChangePassword } from "../application/ChangePassword";
import { MysqlPasswordRepository } from "../infrastructure/MysqlPasswordRepository";
import { BcryptPasswordHasher } from "../infrastructure/BcryptPasswordHasher";

export async function changePasswordController(input: {
  userId: number;
  currentPassword: string;
  newPassword: string;
}) {
  const useCase = new ChangePassword(
    new MysqlPasswordRepository(),
    new BcryptPasswordHasher()
  );

  return useCase.execute(
    input.userId,
    input.currentPassword,
    input.newPassword
  );
}
