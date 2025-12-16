import { RegisterUser } from "../application/RegisterUser";
import { MysqlRegisterUserRepository } from "../infrastructure/MysqlRegisterUserRepository";
import { BcryptPasswordHasher } from "../../password/infrastructure/BcryptPasswordHasher";
import { NodemailerEmailSender } from "../../shared";
import { WelcomeEmailTemplateHtml } from "../infrastructure/WelcomeEmailTemplateHtml";

export async function registerUserController(body: any) {
  const useCase = new RegisterUser(
    new MysqlRegisterUserRepository(),
    new BcryptPasswordHasher(),
    new NodemailerEmailSender(),
    new WelcomeEmailTemplateHtml()
  );

  return useCase.execute(body);
}
