import { UpdateUserProfile } from "../application/UpdateUserProfile";
import { MysqlUserProfileRepository } from "../infrastructure/MysqlUserProfileRepository";

export async function updateUserProfileController(userId: number, body: any) {
  const useCase = new UpdateUserProfile(new MysqlUserProfileRepository());

  await useCase.execute(userId, {
    ...body,
    genderId: body.gender?.id === 0 ? null : body.gender?.id,
  });

  return { message: "Perfil actualizado correctamente" };
}
