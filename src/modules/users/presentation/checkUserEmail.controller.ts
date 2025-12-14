import { CheckUserEmail } from "../application/CheckUserEmail";
import { MysqlUserEmailCheckerRepository } from "../infrastructure/MysqlUserEmailCheckerRepository";

export async function checkUserEmailController(email: string) {
  const useCase = new CheckUserEmail(new MysqlUserEmailCheckerRepository());

  return useCase.execute(email);
}
