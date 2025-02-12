/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

import { handlers } from "@/app/utils/auth";
import GoogleProvider from "next-auth/providers/google";
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Add these callbacks to ensure session works
  callbacks: {
    async session({ session, token }) {
      // Add user ID or any additional info to the session
      session.user.id = token.sub;
      return session;
    },
  },
  // Configure session handling
  session: {
    strategy: "jwt", // Recommended for App Router
  },
});
export const { GET, POST } = handlers;
