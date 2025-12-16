import { DeleteUserProject } from "../application/DeleteUserProject";
import { MysqlUserProjectsRepository } from "../infrastructure/MysqlUserProjectsRepository";

export async function deleteUserProjectController(params: {
  userId: number;
  projectId: number;
}): Promise<void> {
  const useCase = new DeleteUserProject(new MysqlUserProjectsRepository());
  await useCase.execute(params);
}
