import { SearchUserEmails } from "../application/SearchUserEmail";
import { MysqlUserEmailRepository } from "../infrastructure/MysqlUserEmailRepository";

export async function searchUserEmailsController(searchTerm: string) {
  const useCase = new SearchUserEmails(new MysqlUserEmailRepository());
  return useCase.execute(searchTerm);
}
