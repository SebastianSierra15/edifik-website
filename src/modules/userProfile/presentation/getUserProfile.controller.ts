import { GetUserProfile } from "../application/GetUserProfile";
import { MysqlUserProfileRepository } from "../infrastructure/MysqlUserProfileRepository";

export async function getUserProfileController(userId: number) {
  const useCase = new GetUserProfile(new MysqlUserProfileRepository());
  return useCase.execute(userId);
}
