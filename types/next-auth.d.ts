import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    googleRefreshToken?: string;
    googleAccessToken?: string;
    zoomRefreshToken?: string;
    zoomAccessToken?: string;
  }
}