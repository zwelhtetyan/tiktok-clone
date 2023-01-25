import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { User } from '../../../types';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }): Promise<any> {
      const userInfo: User = {
        _id: token?.sub!,
        _type: 'user',
        userName: token?.name!,
        image: token?.picture!,
      };

      await axios.post('http://localhost:3000/api/auth', userInfo);
      return userInfo;
    },
  },
});
