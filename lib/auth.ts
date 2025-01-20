import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Permission } from "./definitios";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
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

        const permissions: Permission[] = permissionsRows.map(
          ({ id, name }) => ({ id, name })
        );

        token.id = userRows[0].id.toString();
        token.role = userRows[0].role.toString();
        token.permissions = permissions;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id + "";
      session.user.role = token.role + "";
      session.user.permissions = token.permissions as Permission[];
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
