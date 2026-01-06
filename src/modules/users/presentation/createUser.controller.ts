import { CreateUser } from "../application/CreateUser";
import { MysqlUserRepository } from "../infrastructure/MysqlUserRepository";
import { CreateUserInput } from "../domain/CreateUserInput";

export async function createUserController(input: CreateUserInput) {
  const useCase = new CreateUser(new MysqlUserRepository());
  await useCase.execute(input);

  return { message: "Usuario creado exitosamente" };
}
