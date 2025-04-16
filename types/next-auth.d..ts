import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Permission } from "@/lib/definitios";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      role?: string | null;
      membershipId?: string | null;
      permissions?: Permission[] | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    membershipId: string;
    permissions: Permission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    membershipId: string;
    permissions: Permission[];
  }
}
