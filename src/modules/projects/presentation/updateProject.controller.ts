import { UpdateProject } from "../application/commands/UpdateProject";
import { ProjectUpdateInput } from "../domain/ProjectUpdateInput";
import { UpdateProjectPolicy } from "../domain/ProjectPolicy";
import { MysqlUpdateProjectRepository } from "../infrastructure/MysqlUpdateProjectRepository";
import { ProjectEditedNotifier } from "../infrastructure/mail/ProjectEditedNotifier";
import { NodemailerEmailSender } from "../../shared";

export async function updateProjectController(
  body: any,
  policy: UpdateProjectPolicy
): Promise<void> {
  const input: ProjectUpdateInput = {
    ...body,
    propertyTypeId: body.propertyType?.id,
    housingTypeId: body.housingType?.id,
    cityId: body.city?.id,
    projectTypeId: body.projectType?.id,
    commonAreaIds: body.commonAreas?.map((area: { id: number }) => area.id),
    nearbyServiceIds: body.nearbyServices?.map(
      (service: { id: number }) => service.id
    ),
  };

  const useCase = new UpdateProject(
    new MysqlUpdateProjectRepository(),
    new ProjectEditedNotifier(new NodemailerEmailSender())
  );

  await useCase.execute(input, policy);
}
