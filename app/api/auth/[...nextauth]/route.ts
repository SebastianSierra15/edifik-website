import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

const handler = NextAuth({
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
        const givenName = name?.split(" ")[0] || "";
        const familyName = name?.split(" ").slice(1).join(" ") || "";

        const [result] = await db.query("CALL get_user_session(?)", [email]);
        let rows = (result as RowDataPacket[][])[0];

        if (rows.length === 0) {
          await db.query("CALL insert_user_provider(?, ?, ?, ?, ?, ?)", [
            name,
            givenName,
            familyName,
            email,
            image,
            "google",
          ]);

          const [updatedResult] = await db.query("CALL get_user_session(?)", [
            email,
          ]);
          rows = (updatedResult as RowDataPacket[][])[0];
        }

        await db.query("CALL update_user_last_login(?)", [rows[0].id]);

        token.id = rows[0].id;
        token.role = rows[0].role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id + "";
      session.user.role = token.role + "";
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
