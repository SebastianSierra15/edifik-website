import { getServerSession } from "../infrastructure/nextAuth/getServerSession";
import { Permission } from "../domain/Permission";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";

type MissingSessionError = "unauthorized" | "forbidden";

interface RequireAuthWithPermissionsOptions {
  missingSessionError?: MissingSessionError;
}

export async function requireAuthWithPermissions(
  permissions: Permission[],
  options: RequireAuthWithPermissionsOptions = {}
) {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    if (options.missingSessionError === "forbidden") {
      throw new ForbiddenError();
    }

    throw new UnauthorizedError();
  }

  if (permissions.length > 0) {
    const userPermissions = session.user.permissions ?? [];

    const hasPermission = permissions.some((required) =>
      userPermissions.some((permission) => permission.name === required)
    );

    if (!hasPermission) {
      throw new ForbiddenError();
    }
  }

  return session;
}
