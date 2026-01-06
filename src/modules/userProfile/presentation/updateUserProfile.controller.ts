import { UpdateUserProfile } from "../application/UpdateUserProfile";
import { MysqlUserProfileRepository } from "../infrastructure/MysqlUserProfileRepository";

interface UpdateUserProfileControllerInput {
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date | string | null;
  phoneNumber?: string;
  genderId?: number | string | null;
  gender?: { id?: number | string | null };
}

export async function updateUserProfileController(
  userId: number,
  body: UpdateUserProfileControllerInput
): Promise<void> {
  const useCase = new UpdateUserProfile(new MysqlUserProfileRepository());
  const rawGenderId = body.genderId ?? body.gender?.id;
  const rawBirthdate = body.birthdate;
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
  const birthdate =
    typeof rawBirthdate === "string"
      ? (() => {
          const parsedDate = new Date(rawBirthdate);
          return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
        })()
      : rawBirthdate ?? null;

  await useCase.execute(userId, {
    ...body,
    birthdate,
    genderId,
  });
}
