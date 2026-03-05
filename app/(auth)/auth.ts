import { NextAuth } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUser } from "./db";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const users = await getUser(email);
        if (users.length === 0) {
          await compare(password, "DUMMY_PASSWORD");
          return null;
        }
        const user = users[0];
        if (!user.password) {
          await compare(password, "DUMMY_PASSWORD");
          return null;
        }
        const passwordsMatch = await compare(password, user.password);
        if (!passwordsMatch) return null;
        return { ...user, type: "regular" };
      },
    }),
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const guestId = `guest-${Date.now()}`;
        return {
          id: guestId,
          name: "Invité Anonyme",
          email: null,
          image: null,
          type: "guest"
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
