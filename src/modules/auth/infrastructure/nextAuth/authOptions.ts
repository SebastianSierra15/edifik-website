import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { RowDataPacket } from "mysql2";
import { compare } from "bcryptjs";
import { UserPermission } from "@/src/shared";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          return null;
        }

        const [result] = await db.query<RowDataPacket[][]>(
          "CALL get_user_session(?)",
          [email]
        );

        const [userRows = [], permissionsRows = []] = result;

        if (userRows.length === 0) {
          return null;
        }

        const user = userRows[0];
        const hashedPassword =
          typeof user.password === "string"
            ? user.password
            : user.password?.toString?.();

        if (!hashedPassword) {
          return null;
        }

        let ispasswordValid = false;

        try {
          ispasswordValid = await compare(password, hashedPassword);
        } catch {
          return null;
        }

        if (!ispasswordValid) {
          return null;
        }

        const permissions: UserPermission[] = permissionsRows.map(
          ({ id, name }) => ({ id, name })
        );

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          membershipId: user.membershipId,
          role: user.role,
          permissions: permissions || [],
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60 * 15,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user) {
        token.id = user.id?.toString() || "";
        token.membershipId = user.membershipId ? String(user.membershipId) : "";
        token.role = user.role ? String(user.role) : "";
        token.permissions = user.permissions || [];
        token.permissions = user.permissions || [];
      }

      if (account?.provider === "google" && user && !token.id) {
        const { email, name, image } = user;

        const [result] = await db.query<RowDataPacket[][]>(
          "CALL get_user_session(?)",
          [email]
        );

        let [userRows = [], permissionsRows = []] = result;

        if (userRows.length === 0) {
          const [resultInsert] = await db.query<RowDataPacket[][]>(
            "CALL insert_user_provider(?, ?, ?, ?)",
            [name, email, image, "Google"]
          );

          [userRows = [], permissionsRows = []] = resultInsert;
        }

        const permissions: UserPermission[] = permissionsRows.map(
          ({ id, name }) => ({ id, name })
        );

        token.id = userRows[0].id?.toString() || "";
        token.membershipId = userRows[0].membershipId
          ? String(userRows[0].membershipId)
          : "";
        token.role = userRows[0].role ? String(userRows[0].role) : "";
        token.permissions = permissions || [];
      }

      if (!token.permissions) {
        token.permissions = [];
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id?.toString() || "";
      session.user.membershipId = token.membershipId?.toString() || "";
      session.user.role = token.role?.toString() || "";
      session.user.permissions = (token.permissions as UserPermission[]) || [];

      return session;
    },
  },

  debug: process.env.AUTH_DEBUG === "true",
};
