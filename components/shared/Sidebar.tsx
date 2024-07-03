"use client";

import Link from 'next/link'
import Image from 'next/image'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button';
import ThemeButton from './ThemeButton';
import LangButton from './LangButton';
import { signIn, signOut, useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';


const Sidebar = () => {
    const pathname = usePathname();
    const {data: session} = useSession();
    //console.log(session)
    
    return (
        <aside className='sidebar'>
            <div className="flex flex-col gap-4 justify-between">
                <Link href='/' className='flex items-center justify-center p-1'>
                    <Image src="/logo-light.png" alt="logo" width={200} height={200} />
                </Link>

                <div className="flex gap-4 items-center justify-center">
                    <ThemeButton/>
                    {/* <LangButton/> */}
                    {/* <UserButton afterSignOutUrl='/'/> */}
                    {
                                session?.user?.image &&  <LogoutButton profile={session?.user?.image}/>
                            }
                </div>

                <nav className="sidebar-nav mt-4 justify-between">
                    {/* <SignedIn> */}
                        <ul className="sidebar-nav_elements">
                            {
                                navLinks.slice(0, 5).map((link) => {
                                    const isActive = link.route === pathname
                                    return (
                                        <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-blue-700' : ''
                                            }`}>
                                            <Link className='sidebar-link' href={link.route}>
                                                <Image src={link.icon} alt='icon' width={24} height={24} className={`${isActive && 'brightness-200'}`} />
                                                {link.label}
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        <ul className="sidebar-nav_elements">
                            {
                                navLinks.slice(5).map((link) => {
                                    const isActive = link.route === pathname
                                    return (
                                        <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-blue-700' : ''
                                            }`}>
                                            <Link className='sidebar-link' href={link.route}>
                                                <Image src={link.icon} alt='icon' width={24} height={24} className={`${isActive && 'brightness-200'}`} />
                                                {link.label}
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                            
                        </ul>
                    {/* </SignedIn> */}

                    {/* <SignedOut> */}
                        {/* <Button asChild className='button bg-purple-gradient bg-cover'>
                            {
                                session?.user ? (<div onClick={() => signOut({callbackUrl: '/'})}>Logout</div>) :  (<div onClick={() => signIn()}>Login</div>)
                            }
                        </Button> */}
                    {/* </SignedOut> */}
                </nav>
            </div>
        </aside>
    )
}

export default Sidebar