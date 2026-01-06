import { getServerSession } from "../infrastructure/nextAuth/getServerSession";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";

export async function requireAuth() {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    throw new UnauthorizedError();
  }

  return session;
}
