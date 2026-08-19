// lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/db";
import type { UserRole } from "@/types/user";

function isUserRole(value: unknown): value is UserRole {
  return (
    value === "CUSTOMER" ||
    value === "STAFF" ||
    value === "ADMIN"
  );
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
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

      async authorize(credentials) {
        if (
          !credentials?.email ||
          typeof credentials.email !== "string" ||
          !credentials.password ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email
          .trim()
          .toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role as UserRole,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  /*
   * The public customer workflow does not require
   * authentication.
   *
   * Staff and admin pages will perform their own
   * server-side authorization checks.
   */
  pages: {
    signIn: "/login/staff",
  },

  callbacks: {
    /*
     * Do not globally require authentication here.
     *
     * Intel-Q has public customer pages where users
     * must be able to:
     *
     * - View available services
     * - Select a service
     * - Enter their first name
     * - Print/download a ticket
     *
     * Protected staff/admin pages will call auth()
     * and explicitly verify the user's role.
     */
    async authorized() {
      return true;
    },

    /*
     * Store user identity and role in the JWT.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    /*
     * Expose the user ID and role to the application
     * through the session.
     */
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

        if (isUserRole(token.role)) {
          session.user.role = token.role;
        }
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
