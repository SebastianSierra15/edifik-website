import { DeleteProjectState } from "../application/commands/DeleteProjectState";
import { MysqlDeleteProjectStateRepository } from "../infrastructure/MysqlDeleteProjectStateRepository";
import { DeleteProjectPolicy } from "../domain/ProjectPolicy";

export async function deleteProjectStateController(
  projectId: number,
  policy: DeleteProjectPolicy
): Promise<void> {
  const useCase = new DeleteProjectState(
    new MysqlDeleteProjectStateRepository()
  );

  await useCase.execute(projectId, policy);
}
