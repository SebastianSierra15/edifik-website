import { getServerSession } from "../infrastructure/nextAuth/getServerSession";
import { Permission } from "../domain/Permission";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";

export async function requirePermission(permission: Permission): Promise<void> {
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new ForbiddenError();
  }

  const hasPermission = session.user.permissions?.some(
    (p) => p.name === permission
  );

  if (!hasPermission) {
    throw new ForbiddenError();
  }
}
