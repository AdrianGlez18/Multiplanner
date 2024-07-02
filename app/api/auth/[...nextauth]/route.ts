import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import ZoomProvider from 'next-auth/providers/zoom'
import type { NextAuthOptions } from "next-auth"
import { saveTokensToDatabase } from '@/lib/actions/user.actions'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
    ZoomProvider({
      clientId: process.env.ZOOM_CLIENT_ID as string,
      clientSecret: process.env.ZOOM_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    /* async signIn({user, account, profile}) {
      const email = user.email
      const localUsername = await getLocalUsername(email)
      user.localUsername = localUsername
      return true
    }, */
    async session({ session, token }: any) {
      session.user.id = token.id;

      session.googleAccessToken = token.googleAccessToken;
      session.googleRefreshToken = token.googleRefreshToken;

      session.zoomAccessToken = token.zoomAccessToken;
      session.zoomRefreshToken = token.zoomRefreshToken;

      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        if (account?.provider === 'google') {
          token.googleAccessToken = account.access_token;
          token.googleRefreshToken = account.refresh_token;

          const currentDatabaseUser = await saveTokensToDatabase(user!.email, 'google',account.access_token!,account.refresh_token!);

          token.zoomAccessToken = currentDatabaseUser.zoomAccessToken;
          token.zoomRefreshToken = currentDatabaseUser.zoomRefreshToken;
        }
        if (account?.provider === 'zoom') {
          token.zoomAccessToken = account.access_token;
          token.zoomRefreshToken = account.refresh_token;

          const currentDatabaseUser = await saveTokensToDatabase(user!.email, 'zoom',account.access_token!,account.refresh_token!);

          token.googleAccessToken = currentDatabaseUser.googleAccessToken;
          token.googleRefreshToken = currentDatabaseUser.googleRefreshToken;
        }
        /* token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; */
        token.id = user.id;
      }
      return token;
    },
  }
}

const authHandler = NextAuth(authOptions)
export { authHandler as GET, authHandler as POST };
export default authHandler;

/* export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
    ZoomProvider({
      clientId: process.env.ZOOM_CLIENT_ID as string,
      clientSecret: process.env.ZOOM_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      try {
        const response = await fetch('http://localhost:4000/api/refresh-tokens', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            "token": token.refreshToken,
          }),
        })
      } catch (error) {
        console.error(error)
      }


      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = user.id;
      }
      return token;
    },
  }
}

export default NextAuth(authOptions)  */