import NextAuth, { DefaultSession } from "next-auth";
import { Permission } from "@/lib/definitios";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      role?: string | null;
      permissions?: Permission[] | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    role?: string;
    permissions?: Permission[];
  }
}
