import { NameValidationTarget } from "@/src/interfaces";
import { NameValidationService } from "@/src/services/nameValidation";

export function useCheckName() {
  const checkName = async (
    target: NameValidationTarget,
    name: string,
    excludeId?: number
  ): Promise<number> => {
    return NameValidationService.checkName({
      target,
      name,
      excludeId,
    });
  };

  return { checkName };
}
