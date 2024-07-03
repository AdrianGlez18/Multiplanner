"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { navLinks } from "@/constants"
import { usePathname } from "next/navigation"
import ThemeButton from "./ThemeButton"

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className="flex justify-between mx-8 items-center h-20 lg:hidden">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        {/* <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28}/> */}
        <Image src="/logo-light.png" alt="Multiplanner" width={30} height={30} />
      </Link>

      <nav className="flex gap-2">
        <Sheet>
          <SheetTrigger>
            <Image
              src="/icons/menu.svg"
              alt="menu"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </SheetTrigger>
          <SheetContent className="sheet-content sm:w-64 bg-blue-400 dark:bg-blue-950">
            <>
            <div className="px-2">
            <ThemeButton/>
            </div>
              <ul className="header-nav_elements">
                {navLinks.map((link) => {
                  const isActive = link.route === pathname

                  return (
                    <li
                      className={`${isActive && 'gradient-text bg-blue-500 dark:bg-blue-700'} p-18 flex whitespace-nowrap sidebar-nav_element group`}
                      key={link.route}
                    >
                      <Link className="sidebar-link cursor-pointer" href={link.route}>
                        <Image
                          src={link.icon}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export default MobileNav