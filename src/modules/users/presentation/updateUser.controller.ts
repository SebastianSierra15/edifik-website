import { UpdateUser } from "../application/UpdateUser";
import { MysqlUserRepository } from "../infrastructure/MysqlUserRepository";
import { getServerSession } from "../../auth";

export async function updateUserController(body: any) {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const useCase = new UpdateUser(new MysqlUserRepository());

  await useCase.execute({
    id: body.id,
    names: body.names,
    lastnames: body.lastnames,
    email: body.email,
    phoneNumber: body.phoneNumber,
    genderId: body.gender.id,
    roleId: body.role.id,
    membershipId: body.membership?.id,
    state: body.state ?? false,
    updatedBy: session.user.id,
  });

  return { message: "Usuario actualizado exitosamente" };
}
