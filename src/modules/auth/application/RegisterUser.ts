import { BadRequestError } from "@/src/shared";
import { RegisterUserRepository } from "../domain/RegisterUserRepository";
import { PasswordHasher } from "../../password/domain/Password";
import { EmailSender } from "../../shared";
import { WelcomeEmailTemplate } from "../domain/WelcomeEmailTemplate";

interface RegisterUserInput {
  names: string;
  lastnames: string;
  birthdate: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export class RegisterUser {
  constructor(
    private readonly repo: RegisterUserRepository,
    private readonly hasher: PasswordHasher,
    private readonly emailSender: EmailSender,
    private readonly welcomeTemplate: WelcomeEmailTemplate
  ) {}

  async execute(input: RegisterUserInput) {
    const { names, lastnames, birthdate, email, phoneNumber, password } = input;

    if (
      !names ||
      !lastnames ||
      !birthdate ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      throw new BadRequestError("Todos los campos son obligatorios");
    }

    if (!email.includes("@")) {
      throw new BadRequestError("Correo electrónico no válido");
    }

    const passwordHash = await this.hasher.hash(password);

    await this.repo.register({
      names,
      lastnames,
      birthdate,
      email,
      phoneNumber,
      passwordHash,
    });

    const html = this.welcomeTemplate.build({
      names,
      email,
      phoneNumber,
    });

    await this.emailSender.send(email, "Bienvenido a EdifiK", html);

    return { message: "Usuario registrado exitosamente" };
  }
}
