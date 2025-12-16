import { NodemailerEmailSender } from "../../shared";
import { SendPasswordRecoveryCode } from "../application/SendPasswordRecoveryCode";
import { MysqlPasswordRepository } from "../infrastructure/MysqlPasswordRepository";
import { RandomPasswordGenerator } from "../infrastructure/RandomPasswordGenerator";
import { BcryptPasswordHasher } from "../infrastructure/BcryptPasswordHasher";
import { PasswordRecoveryEmailTemplate } from "../domain/PasswordRecoveryEmailTemplate";

export async function sendRecoveryCodeController(email: string) {
  const useCase = new SendPasswordRecoveryCode(
    new MysqlPasswordRepository(),
    new RandomPasswordGenerator(),
    new BcryptPasswordHasher(),
    new NodemailerEmailSender(),
    new PasswordRecoveryEmailTemplate()
  );

  return useCase.execute(email);
}
