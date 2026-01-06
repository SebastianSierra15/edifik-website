import { BRAND } from "@/src/config";
import { BadRequestError } from "@/src/shared";
import { PasswordRecoveryEmailTemplate } from "../domain/PasswordRecoveryEmailTemplate";
import { PasswordRepository } from "../domain/PasswordRepository";
import { PasswordGenerator, PasswordHasher } from "../domain/Password";
import { EmailSender } from "../../shared";

export class SendPasswordRecoveryCode {
  constructor(
    private readonly repo: PasswordRepository,
    private readonly generator: PasswordGenerator,
    private readonly hasher: PasswordHasher,
    private readonly emailSender: EmailSender,
    private readonly emailTemplate: PasswordRecoveryEmailTemplate
  ) {}

  async execute(email: string) {
    if (!email) {
      throw new BadRequestError("El correo electrónico es obligatorio");
    }

    if (!email.includes("@")) {
      throw new BadRequestError("El correo electrónico no es válido");
    }

    const tempPassword = this.generator.generate();
    const hash = await this.hasher.hash(tempPassword);

    await this.repo.setTemporaryPassword(email, hash);

    const html = this.emailTemplate.build(tempPassword);

    await this.emailSender.send(
      email,
      `Recuperación de contraseña - ${BRAND.name}`,
      html
    );

    return { message: "Código enviado al correo electrónico" };
  }
}
