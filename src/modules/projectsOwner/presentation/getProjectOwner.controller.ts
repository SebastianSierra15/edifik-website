import { GetProjectOwnerByEmail } from "../application/GetProjectOwnerByEmail";
import { MysqlGetProjectOwnerRepository } from "../infrastructure/MysqlGetProjectOwnerRepository";

export async function getProjectOwnerController(input: {
  email: string | null;
}) {
  const useCase = new GetProjectOwnerByEmail(
    new MysqlGetProjectOwnerRepository()
  );

  return useCase.execute(input.email);
}
