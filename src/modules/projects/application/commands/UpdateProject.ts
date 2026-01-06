import { BadRequestError } from "@/src/shared";
import { ProjectUpdateInput } from "../../domain/ProjectUpdateInput";
import { UpdateProjectPolicy } from "../../domain/ProjectPolicy";
import { UpdateProjectRepository } from "../../domain/ProjectsRepository";
import { ProjectEditedNotifier } from "../../infrastructure/mail/ProjectEditedNotifier";

export class UpdateProject {
  constructor(
    private readonly repo: UpdateProjectRepository,
    private readonly notifier: ProjectEditedNotifier
  ) {}

  async execute(
    input: ProjectUpdateInput,
    policy: UpdateProjectPolicy
  ): Promise<void> {
    if (
      !input.id ||
      !input.name ||
      !input.builtArea ||
      !input.totalArea ||
      !input.shortDescription ||
      !input.detailedDescription ||
      !input.address ||
      !input.latitude ||
      !input.longitude ||
      !input.propertyTypeId ||
      !input.cityId
    ) {
      throw new BadRequestError(
        "Faltan datos obligatorios para actualizar el proyecto"
      );
    }

    const state = policy.isClient ? "3" : "1";

    const finalOwnerId = policy.canManageAll
      ? (input.ownerId ?? policy.userId)
      : policy.userId;

    await this.repo.updateProject({
      ...input,
      state,
      ownerId: finalOwnerId,
    });

    if (!policy.isClient) {
      await this.notifier.notify({
        projectName: input.name,
        ownerEmail: String(input.ownerId ?? ""),
      });
    }
  }
}
