import { RegisterUser } from "../application/RegisterUser";
import { MysqlRegisterUserRepository } from "../infrastructure/MysqlRegisterUserRepository";
import { BcryptPasswordHasher } from "../../password/infrastructure/BcryptPasswordHasher";
import { NodemailerEmailSender } from "../../shared";
import { WelcomeEmailTemplateHtml } from "../infrastructure/WelcomeEmailTemplateHtml";

interface RegisterUserControllerInput {
  names: string;
  lastnames: string;
  birthdate: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export async function registerUserController(
  body: RegisterUserControllerInput
) {
  const useCase = new RegisterUser(
    new MysqlRegisterUserRepository(),
    new BcryptPasswordHasher(),
    new NodemailerEmailSender(),
    new WelcomeEmailTemplateHtml()
  );

  return useCase.execute(body);
}
