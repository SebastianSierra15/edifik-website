import { DeleteUserProject } from "../application/DeleteUserProject";
import { MysqlUserProjectsRepository } from "../infrastructure/MysqlUserProjectsRepository";

export async function deleteUserProjectController(params: {
  userId: number;
  projectId: number;
}) {
  const useCase = new DeleteUserProject(new MysqlUserProjectsRepository());
  await useCase.execute(params);
  return { message: "Proyecto eliminado correctamente." };
}
