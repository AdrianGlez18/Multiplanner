//import MobileNav from '@/components/shared/MobileNav'
import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions)
  return (
    <div className="flex flex-col lg:flex-row">
      {
        session ? (
          <>
            <Sidebar />
            <MobileNav />
            {children}
            <Toaster />
          </>
        ) : (
          <>
            {children}
          </>
        )
      }
        
      
    </div>
  )
}

export default Layout


