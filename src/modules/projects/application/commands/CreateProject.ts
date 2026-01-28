import { BadRequestError } from "@/src/shared";
import { ProjectCreateInput } from "../../domain/ProjectCreateInput";
import { CreateProjectPolicy } from "../../domain/ProjectPolicy";
import { CreateProjectRepository } from "../../domain/ProjectsRepository";
import { ProjectCreatedNotifier } from "../../infrastructure/mail/ProjectCreatedNotifier";

export class CreateProject {
  constructor(
    private readonly repo: CreateProjectRepository,
    private readonly notifier: ProjectCreatedNotifier,
  ) {}

  async execute(
    input: ProjectCreateInput,
    policy: CreateProjectPolicy,
  ): Promise<number> {
    if (
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
        "Faltan datos obligatorios para crear el proyecto",
      );
    }

    const state = "0";

    const finalOwnerId = policy.canManageAll
      ? (input.ownerId ?? 1)
      : policy.userId;

    const projectId = await this.repo.createProject({
      ...input,
      state,
      ownerId: finalOwnerId,
    });

    if (policy.isClient) {
      await this.notifier.notify({
        projectName: input.name,
        ownerEmail: String(input.ownerId ?? ""),
      });
    }

    return projectId;
  }
}
