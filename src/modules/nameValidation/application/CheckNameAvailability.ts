import { BadRequestError } from "@/src/shared";
import { NameValidationRepository } from "../domain/NameValidationRepository";
import { NameValidationTarget } from "../domain/NameValidationTarget";

export class CheckNameAvailability {
  constructor(private readonly repo: NameValidationRepository) {}

  async execute(input: {
    target?: NameValidationTarget;
    name?: string;
    excludeId?: number | null;
  }) {
    const { target, name, excludeId } = input;

    if (!target || !name) {
      throw new BadRequestError("Datos inválidos para validar el nombre");
    }

    const total = await this.repo.countByName({
      target,
      name,
      excludeId,
    });

    return { total };
  }
}
