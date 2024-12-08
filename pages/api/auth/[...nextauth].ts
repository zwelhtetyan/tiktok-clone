import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { client } from '../../../utils/client';

export const AUTH_OPTIONS = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: 'zwel',
  callbacks: {
    async session({ token }): Promise<any> {
      const userInfo = {
        _id: token?.sub!,
        _type: 'user',
        userName: token?.name!,
        image: token?.picture!,
      };

      await client.createIfNotExists(userInfo);
      return userInfo;
    },
  },
} satisfies NextAuthOptions;

export default NextAuth(AUTH_OPTIONS);
