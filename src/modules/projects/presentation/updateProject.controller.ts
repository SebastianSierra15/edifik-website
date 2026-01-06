import { UpdateProject } from "../application/commands/UpdateProject";
import { ProjectUpdateInput } from "../domain/ProjectUpdateInput";
import { UpdateProjectPolicy } from "../domain/ProjectPolicy";
import { MysqlUpdateProjectRepository } from "../infrastructure/MysqlUpdateProjectRepository";
import { ProjectEditedNotifier } from "../infrastructure/mail/ProjectEditedNotifier";
import { NodemailerEmailSender } from "../../shared";

interface UpdateProjectControllerInput extends ProjectUpdateInput {
  propertyType?: { id?: number };
  housingType?: { id?: number };
  city?: { id?: number };
  projectType?: { id?: number };
  commonAreas?: Array<{ id: number }>;
  nearbyServices?: Array<{ id: number }>;
}

export async function updateProjectController(
  body: UpdateProjectControllerInput,
  policy: UpdateProjectPolicy
): Promise<void> {
  const baseInput = body as ProjectUpdateInput;

  const input: ProjectUpdateInput = {
    ...baseInput,
    propertyTypeId: body.propertyType?.id ?? baseInput.propertyTypeId,
    housingTypeId: body.housingType?.id ?? baseInput.housingTypeId,
    cityId: body.city?.id ?? baseInput.cityId,
    projectTypeId: body.projectType?.id ?? baseInput.projectTypeId,
    commonAreaIds:
      body.commonAreas?.map((area) => area.id) ??
      baseInput.commonAreaIds ??
      null,
    nearbyServiceIds:
      body.nearbyServices?.map((service) => service.id) ??
      baseInput.nearbyServiceIds ??
      null,
  };

  const useCase = new UpdateProject(
    new MysqlUpdateProjectRepository(),
    new ProjectEditedNotifier(new NodemailerEmailSender())
  );

  await useCase.execute(input, policy);
}
