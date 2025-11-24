import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from './lib/db';
import { JWT } from 'next-auth/jwt';

const SESSION_TIMEOUT_MINUTES = 10;
const SESSION_TIMEOUT_SECONDS = SESSION_TIMEOUT_MINUTES * 60;
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_SECONDS * 1000;
const TOKEN_UPDATE_INTERVAL_SECONDS = 60;

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: SESSION_TIMEOUT_SECONDS,
    updateAge: TOKEN_UPDATE_INTERVAL_SECONDS,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.lastActivity = Date.now();
      }

      if (trigger === 'update') {
        token.lastActivity = Date.now();
      }

      const lastActivity = token.lastActivity as number;
      if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT_MS) {
        return null;
      }

      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user || !user.password) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        const { password: _, ...userWithoutPassword } = user;

        return {
          ...userWithoutPassword,
        };
      },
    }),
  ],
});
