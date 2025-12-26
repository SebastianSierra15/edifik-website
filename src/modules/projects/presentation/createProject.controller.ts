import { CreateProject } from "../application/commands/CreateProject";
import { MysqlCreateProjectRepository } from "../infrastructure/MysqlCreateProjectRepository";
import { ProjectCreatedNotifier } from "../infrastructure/mail/ProjectCreatedNotifier";
import { NodemailerEmailSender } from "../../shared";
import { ProjectCreateInput } from "../domain/ProjectCreateInput";
import { CreateProjectPolicy } from "../domain/ProjectPolicy";

export async function createProjectController(
  body: any,
  policy: CreateProjectPolicy
): Promise<number> {
  const input: ProjectCreateInput = {
    ...body,
    propertyTypeId: body.propertyType?.id,
    housingTypeId: body.housingType?.id,
    cityId: body.city?.id,
    membershipId: body.membership,
    projectTypeId: body.projectType?.id,
    commonAreaIds: body.commonAreas?.map((a: { id: number }) => a.id),
    nearbyServiceIds: body.nearbyServices?.map((s: { id: number }) => s.id),
  };

  const useCase = new CreateProject(
    new MysqlCreateProjectRepository(),
    new ProjectCreatedNotifier(new NodemailerEmailSender())
  );

  return useCase.execute(input, policy);
}
