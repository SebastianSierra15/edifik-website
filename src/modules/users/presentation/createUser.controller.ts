import { CreateUser } from "../application/CreateUser";
import { MysqlUserRepository } from "../infrastructure/MysqlUserRepository";
import { getServerSession } from "../../auth";

export async function createUserController(body: any) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("No autenticado");
  }

  const userId = session.user.id;

  if (!userId) {
    throw new Error("Usuario autenticado sin identificador");
  }

  const useCase = new CreateUser(new MysqlUserRepository());

  await useCase.execute({
    names: body.names,
    lastnames: body.lastnames,
    email: body.email,
    phoneNumber: body.phoneNumber,
    genderId: body.gender.id,
    roleId: body.role.id,
    membershipId: body.membership?.id,
    state: body.state ?? false,
    createdBy: userId,
  });

  return { message: "Usuario creado exitosamente" };
}
