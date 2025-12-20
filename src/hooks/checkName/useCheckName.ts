import { apiClient } from "@/src/lib";
import { NameValidationTarget } from "@/src/modules/nameValidation/domain/NameValidationTarget";

export function useCheckName() {
  const checkName = async (
    target: NameValidationTarget,
    name: string,
    excludeId?: number
  ): Promise<number> => {
    const params = new URLSearchParams({
      target,
      name,
    });

    if (excludeId !== undefined) {
      params.set("id", excludeId.toString());
    }

    const { total } = await apiClient.get<{ total: number }>(
      `/api/check-name?${params.toString()}`
    );

    return total;
  };

  return { checkName };
}
