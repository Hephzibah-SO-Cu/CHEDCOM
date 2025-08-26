/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import type { AuthOptions, User } from 'next-auth';
import type { SessionStrategy } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from './mongoose';
import UserModel from '@/models/User';
import { comparePassword as comparePasswordUtil } from './auth-utils'; // <- singular

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (typeof comparePasswordUtil === 'function') {
    return comparePasswordUtil(password, hash);
  }
  return bcrypt.compare(password, hash);
}

// --- NextAuth Config ---
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await UserModel.findOne({ email: credentials?.email });
        if (!user) return null;

        const isValid = await comparePassword(credentials!.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          canManageAdmins: user.canManageAdmins,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.canManageAdmins = (user as any).canManageAdmins || false;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.canManageAdmins = token.canManageAdmins as boolean;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

