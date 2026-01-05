import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { UserPermission } from "@/src/modules/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      role?: string | null;
      membershipId?: string | null;
      permissions?: UserPermission[] | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    membershipId: string;
    permissions: UserPermission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    membershipId: string;
    permissions: UserPermission[];
  }
}
