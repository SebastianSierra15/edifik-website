import { MysqlProjectMediaRepository } from "../infrastructure/MysqlProjectMediaRepository";
import { CreateProjectMedia } from "../application/commands/CreateProjectMedia";
import { UpdateProjectMedia } from "../application/commands/UpdateProjectMedia";
import { DeleteProjectMedia } from "../application/commands/DeleteProjectMedia";
import { ProjectMediaInput } from "../domain/ProjectMediaInput";

const repository = new MysqlProjectMediaRepository();

export async function createProjectMediaController(media: ProjectMediaInput[]) {
  return new CreateProjectMedia(repository).execute(media);
}

export async function updateProjectMediaController(media: ProjectMediaInput[]) {
  return new UpdateProjectMedia(repository).execute(media);
}

export async function deleteProjectMediaController(mediaIds: number[]) {
  return new DeleteProjectMedia(repository).execute(mediaIds);
}
