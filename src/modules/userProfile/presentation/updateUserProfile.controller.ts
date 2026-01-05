import { UpdateUserProfile } from "../application/UpdateUserProfile";
import { MysqlUserProfileRepository } from "../infrastructure/MysqlUserProfileRepository";

export async function updateUserProfileController(
  userId: number,
  body: any
): Promise<void> {
  const useCase = new UpdateUserProfile(new MysqlUserProfileRepository());
  const rawGenderId = body.genderId ?? body.gender?.id;
  const parsedGenderId =
    rawGenderId === null || rawGenderId === undefined || rawGenderId === ""
      ? null
      : Number(rawGenderId);
  const genderId =
    typeof parsedGenderId === "number" && Number.isFinite(parsedGenderId)
      ? parsedGenderId === 0
        ? null
        : parsedGenderId
      : null;

  await useCase.execute(userId, {
    ...body,
    genderId,
  });
}
