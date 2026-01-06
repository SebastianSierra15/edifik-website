import { getServerSession as nextGetServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getServerSession() {
  return nextGetServerSession(authOptions);
}
