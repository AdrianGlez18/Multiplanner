"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from 'next-auth/react';

function LogoutButton({profile}: {profile: string}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img src={profile} height={24} width={24} alt="User profile" className='rounded-full cursor-pointer'/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut({callbackUrl: '/'})}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default LogoutButton;