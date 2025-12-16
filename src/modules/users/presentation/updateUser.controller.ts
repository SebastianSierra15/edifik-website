import { UpdateUser } from "../application/UpdateUser";
import { MysqlUserRepository } from "../infrastructure/MysqlUserRepository";
import { UpdateUserInput } from "../domain/UpdateUserInput";

export async function updateUserController(input: UpdateUserInput) {
  const useCase = new UpdateUser(new MysqlUserRepository());
  await useCase.execute(input);

  return { message: "Usuario actualizado exitosamente" };
}
