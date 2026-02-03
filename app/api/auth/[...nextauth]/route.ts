import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

const handler = NextAuth({
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
  ],
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn(message) {
      // no-op hook placeholder
    },
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        if (token?.sub) session.user.id = token.sub;
        else if ((user as any)?.id) (session.user as any).id = (user as any).id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

