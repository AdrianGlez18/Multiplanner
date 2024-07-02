"use client"

import React from 'react'
import { Button } from '../ui/button'
//import { createMeeting } from '@/lib/actions/meet.actions'
import { create } from '@/lib/actions/meeting.actions'

const MeetingButton = () => {
    return (

        <Button className='bg-green-500 text-white flex gap-6 justify-center items-center hover:bg-green-400 h-16' onClick={() => create()}>
            <img src="/icons/zoom.png" alt='zoom' width={30} height={30} />
            Google Meet
        </Button>

    )
}

export default MeetingButton