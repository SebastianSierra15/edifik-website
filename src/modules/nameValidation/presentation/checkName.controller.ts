import { CheckNameAvailability } from "../application/CheckNameAvailability";
import { MysqlNameValidationRepository } from "../infrastructure/MysqlNameValidationRepository";

export async function checkNameController(input: {
  target?: string;
  name?: string;
  excludeId?: number | null;
}) {
  const useCase = new CheckNameAvailability(
    new MysqlNameValidationRepository()
  );

  return useCase.execute({
    target: input.target as any,
    name: input.name,
    excludeId: input.excludeId,
  });
}
