/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'superadmin';
      canManageAdmins: boolean;
    };
  }

  interface User {
    id: string;
    role: 'admin' | 'superadmin';
    canManageAdmins: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'superadmin';
    canManageAdmins: boolean;
  }
}
