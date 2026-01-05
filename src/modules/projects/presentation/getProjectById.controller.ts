import { GetProjectById } from "../application/queries/GetProjectById";
import { MysqlGetProjectByIdRepo } from "../infrastructure/MysqlGetProjectByIdRepo";

export async function getProjectByIdController(input: {
  projectId: number;
  isProject: number;
  isAdmin: number;
  canSeeMembership: boolean;
  ownerId?: number | null;
}) {
  return new GetProjectById(new MysqlGetProjectByIdRepo()).execute(input);
}
