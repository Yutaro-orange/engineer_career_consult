import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// @ts-expect-error next-auth@5.0.0-beta.30 の型定義が Next.js 16 に未対応
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    session({ session, user }: { session: any; user: any }) {
      session.user.id = user.id
      return session
    },
    authorized({ auth }: { auth: any }) {
      return !!auth
    },
    redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith(baseUrl)) return url
      return `${baseUrl}/menu`
    },
  },
})