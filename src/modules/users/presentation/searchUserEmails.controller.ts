import { SearchUserEmails } from "../application/SearchUserEmail";
import { MysqlUserEmailRepository } from "../infrastructure/MysqlUserEmailRepository";
import { getServerSession } from "@/src/modules/auth";
import { Permission } from "@/src/modules/auth";
import { ForbiddenError } from "@/src/shared/errors/ForbiddenError";

export async function searchUserEmailsController(searchTerm: string) {
  const session = await getServerSession();

  if (!session) {
    throw new ForbiddenError();
  }

  const hasPermission = session.user.permissions?.some(
    (p) => p.name === Permission.ManageProperties
  );

  if (!hasPermission) {
    throw new ForbiddenError();
  }

  const useCase = new SearchUserEmails(new MysqlUserEmailRepository());

  return useCase.execute(searchTerm);
}
