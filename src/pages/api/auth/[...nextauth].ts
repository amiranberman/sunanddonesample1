import GoogleProvider from "next-auth/providers/google";
import CognitoProvider from "next-auth/providers/cognito";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/client";
import { NextAuthOptions } from "next-auth/core/types";
import NextAuth from "next-auth/next";
// import { env } from "../../../server/env.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "#ed981c", // Hex color code
    logo: "/images/logo.png", // Absolute URL to image
    buttonText: "test", // Hex color code
  },
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
      };
      return session;
    },
  },
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    // ...add more providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER,
    }),
    // CredentialsProvider({
    //   id: "anonymous",
    //   name: "Anonymous",
    //   credentials: { id: {} },
    //   async authorize(_credentials, _req) {
    //     const anonymousUser = await prisma.user.create({
    //       data: {},
    //       select: {
    //         id: true,
    //       },
    //     });
    //     return anonymousUser;
    //   },
    // }),
  ],
};

export default NextAuth(authOptions);
