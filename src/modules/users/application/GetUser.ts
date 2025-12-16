import { BadRequestError } from "@/src/shared";
import { UserRepository } from "../domain/UserRepository";

interface GetUsersParams {
  page: number;
  pageSize: number;
  searchTerm: string | null;
}

export class GetUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(params: GetUsersParams) {
    const { page, pageSize } = params;

    if (page < 1) {
      throw new BadRequestError("Parámetro page inválido");
    }

    if (pageSize < 1) {
      throw new BadRequestError("Parámetro pageSize inválido");
    }

    return this.repository.findPaginated(params);
  }
}
