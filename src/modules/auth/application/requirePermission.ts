import { getServerSession } from "../infrastructure/nextAuth/getServerSession";
import { Permission } from "../domain/Permission";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";

export async function requirePermission(
  ...permissions: Permission[]
): Promise<void> {
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new ForbiddenError();
  }

  const userPermissions = session.user.permissions ?? [];

  const hasPermission = permissions.some((required) =>
    userPermissions.some((p) => p.name === required)
  );

  if (!hasPermission) {
    throw new ForbiddenError();
  }
}
