import { apiClient } from "@/src/lib";
import { NameValidationTarget, CheckNameResponse } from "@/src/interfaces";

interface CheckNameParams {
  target: NameValidationTarget;
  name: string;
  excludeId?: number;
}

export class NameValidationService {
  static async checkName(params: CheckNameParams): Promise<number> {
    const query = new URLSearchParams({
      target: params.target,
      name: params.name,
    });

    if (params.excludeId !== undefined) {
      query.append("id", String(params.excludeId));
    }

    const { total } = await apiClient.get<CheckNameResponse>(
      `/api/check-name?${query.toString()}`
    );

    return total;
  }
}
