import GoogleProvider from 'next-auth/providers/google'
import ZoomProvider from 'next-auth/providers/zoom'
import type { NextAuthOptions } from "next-auth"
import { saveTokensToDatabase } from '@/lib/actions/user.actions'

export const authOptions: NextAuthOptions = {
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
          token.id = user.id;
        }
        return token;
      },
    }
  }