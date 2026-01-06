import { CreateProject } from "../application/commands/CreateProject";
import { MysqlCreateProjectRepository } from "../infrastructure/MysqlCreateProjectRepository";
import { ProjectCreatedNotifier } from "../infrastructure/mail/ProjectCreatedNotifier";
import { NodemailerEmailSender } from "../../shared";
import { ProjectCreateInput } from "../domain/ProjectCreateInput";
import { CreateProjectPolicy } from "../domain/ProjectPolicy";

interface CreateProjectControllerInput extends Partial<ProjectCreateInput> {
  propertyType?: { id?: number };
  housingType?: { id?: number };
  city?: { id?: number };
  membership?: number | null;
  projectType?: { id?: number };
  commonAreas?: Array<{ id: number }>;
  nearbyServices?: Array<{ id: number }>;
}

export async function createProjectController(
  body: CreateProjectControllerInput,
  policy: CreateProjectPolicy
): Promise<number> {
  const baseInput = body as ProjectCreateInput;

  const input: ProjectCreateInput = {
    ...baseInput,
    propertyTypeId: body.propertyType?.id ?? baseInput.propertyTypeId,
    housingTypeId: body.housingType?.id ?? baseInput.housingTypeId,
    cityId: body.city?.id ?? baseInput.cityId,
    membershipId: body.membership ?? baseInput.membershipId,
    projectTypeId: body.projectType?.id ?? baseInput.projectTypeId,
    commonAreaIds:
      body.commonAreas?.map((a) => a.id) ??
      baseInput.commonAreaIds ??
      null,
    nearbyServiceIds:
      body.nearbyServices?.map((s) => s.id) ??
      baseInput.nearbyServiceIds ??
      null,
  };

  const useCase = new CreateProject(
    new MysqlCreateProjectRepository(),
    new ProjectCreatedNotifier(new NodemailerEmailSender())
  );

  return useCase.execute(input, policy);
}
