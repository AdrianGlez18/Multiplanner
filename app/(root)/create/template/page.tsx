import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const PlanAMeeting = () => {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center w-full gap-8'>
            <h2 className='text-center text-4xl'>Plan A Meeting</h2>
            <h3 className='text-center text-2xl'>Select the type of meeting</h3>
            <div className="flex justify-around items-center gap-16">
                <Link href="/create/zoom" passHref>
                    <Button className='bg-blue-500 text-white flex gap-6 justify-center items-center hover:bg-blue-400 h-16'>
                        <img src="/icons/zoom.png" alt='zoom' width={30} height={30} />
                        Zoom
                    </Button>
                </Link>
                <Link href="/create/meet" passHref>
                    <Button className='bg-green-500 text-white flex gap-6 justify-center items-center hover:bg-green-400 h-16'>
                        <img src="/icons/zoom.png" alt='zoom' width={30} height={30} />
                        Google Meet
                    </Button>
                </Link>
                <Link href="/create/template" passHref>
                    <Button className='bg-yellow-500 text-white flex gap-6 justify-center items-center hover:bg-yellow-400 h-16'>
                        <img src="/icons/zoom.png" alt='zoom' width={30} height={30} />
                        With template
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PlanAMeeting