"use client"

import ThemeButton from "@/components/shared/ThemeButton";
import TypingText from "@/components/shared/TypingText";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      {
        session ? (
          <div className="flex flex-col w-full items-center justify-around xl:my-20">
            <h1 className="text-bold text-lg xl:text-3xl">Welcome, {session.user?.name}</h1>
            {session.googleAccessToken === '' /* || 1 !== 2 */ ? (
              <div className="flex flex-col justify-around gap-4 xl:gap-6 items-center">
              <p className="text-center text-lg">
                You have not logged with Google. It is required to schedule meetings and <i>to store them in calendar</i>. Please, vinculate your account here:
              </p>
              <Button onClick={() => signIn('google')} className="bg-green-500 max-w-40 w-full">Sign In with Google</Button>
              <p className="text-center text-lg">
                You can also continue using only Zoom, but meetings will not be on Google Calendar.
              </p>
            </div>
            ) : ''}
            {session.zoomAccessToken === '' /* || 1 !== 2 */ ? (
              <div className="flex flex-col justify-around gap-4 xl:gap-6 items-center">
                <p className="text-center text-lg">
                  You have not logged with Zoom. It is required to schedule meetings. Please, vinculate your account here:
                </p>
                <Button onClick={() => signIn('zoom')} className="bg-blue-500 max-w-40 w-full">Sign In with Zoom</Button>
                <p className="text-center text-lg">
                  You can also continue using only Google.
                </p>
              </div>
            ) : ''}
            {session.zoomAccessToken !== '' && session.googleAccessToken !== '' ? (
              <p className="text-center text-lg">
                You have configured both Google and Zoom. Now you can use them and check their data!
              </p>
            ) : ''
            }
            <div className="flex justify-around p-2 m-2 gap-3">

              <Link href='/create' passHref className="items-center justify-center w-full">
                <div
                  className={`cursor-pointer bg-red-500 text-white px-3 py-6 flex flex-col justify-around w-full min-h-[200px] max-w-[500px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
                  <div className="flex gap-4">
                    <img src='/icons/add-meeting.svg' height={30} width={30} alt='Schedule meetings' className="mx-2" />
                    <h2 className="font-bold text-left mx-4 text-xl">Schedule meeting</h2>
                  </div>
                  <p className="text-left mx-4 text-md">Prepare meetings with Zoom or Google</p>
                </div>
              </Link>

              <Link href='/upcoming' passHref className="items-center justify-center w-full">
                <div
                  className={`cursor-pointer bg-blue-500 text-white px-3 py-6 flex flex-col justify-around w-full min-h-[200px] max-w-[500px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
                  <div className="flex gap-4">
                    <img src='/icons/upcoming.svg' height={30} width={30} alt='Schedule meetings' className="mx-2" />
                    <h2 className="font-bold text-left mx-4 text-xl">Upcoming meetings</h2>
                  </div>
                  <p className="text-left mx-4 text-md">Check or edit scheduled meetings</p>
                </div>
              </Link>

              <Link href='/previous' passHref className="items-center justify-center w-full">
                <div
                  className={`cursor-pointer bg-green-500 text-white px-3 py-6 flex flex-col justify-around w-full min-h-[200px] max-w-[500px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
                  <div className="flex gap-4">
                    <img src='/icons/previous.svg' height={30} width={30} alt='Schedule meetings' className="mx-2" />
                    <h2 className="font-bold text-left mx-4 text-xl">Previous meetings</h2>
                  </div>
                  <p className="text-left mx-4 text-md">Check previous meetings details or analytics</p>
                </div>
              </Link>

              <Link href='/analytics' passHref className="items-center justify-center w-full">
                <div
                  className={`cursor-pointer bg-yellow-500 text-white px-3 py-6 flex flex-col justify-around w-full min-h-[200px] max-w-[500px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
                  <div className="flex gap-4">
                    <img src='/icons/analytics.svg' height={30} width={30} alt='Schedule meetings' className="mx-2" />
                    <h2 className="font-bold text-left mx-4 text-xl">Analytics</h2>
                  </div>
                  <p className="text-left mx-4 text-md">General Analytics of your account</p>
                </div>
              </Link>

            </div>
          </div>
        ) : (
          <main className="absolute inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
            <div className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
              <Image src="/logo-light.png" alt="logo" width={250} height={250} />
              <TypingText text="Manage your meeting and records easily!" speed={150} />
              <div className="flex items-center justify-around w-full max-w-3xl">
                <Button onClick={() => signIn()} className="bg-green-400 min-w-40">Sign In</Button>
                <Button onClick={() => signIn()} className="bg-green-600 min-w-40">Sign Up</Button>
              </div>
              <div className="flex items-center justify-around w-full max-w-lg">
                <Link href='/privacy-policy'>Privacy Policy</Link>
                {/* <p>About us</p> */}
              </div>
            </div>
          </main>
        )
      }
    </>
  );
}
