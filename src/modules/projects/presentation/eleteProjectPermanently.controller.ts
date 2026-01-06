import { DeleteProjectPermanently } from "../application/commands/DeleteProjectPermanently";
import { MysqlDeleteProjectPermanentlyRepository } from "../infrastructure/MysqlDeleteProjectPermanentlyRepository";
import { DeleteProjectPolicy } from "../domain/ProjectPolicy";

export async function deleteProjectPermanentlyController(
  projectId: number,
  policy: DeleteProjectPolicy
): Promise<void> {
  const useCase = new DeleteProjectPermanently(
    new MysqlDeleteProjectPermanentlyRepository()
  );

  await useCase.execute(projectId, policy);
}
