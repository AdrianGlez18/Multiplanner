"use client"

import { SessionProvider } from "next-auth/react";

const UserSessionProvider = ({children} : any) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default UserSessionProvider