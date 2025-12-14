import { getServerSession } from "../infrastructure/nextAuth/getServerSession";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";

export async function requireAuth() {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    throw new UnauthorizedError();
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new UnauthorizedError();
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: userId,
    },
  };
}
