import { NameValidationTarget } from "./NameValidationTarget";

export interface NameValidationRepository {
  countByName(params: {
    target: NameValidationTarget;
    name: string;
    excludeId?: number | null;
  }): Promise<number>;
}
