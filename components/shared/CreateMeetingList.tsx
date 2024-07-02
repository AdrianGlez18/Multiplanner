"use client"

import { z } from "zod"
import MeetingCardTest from './MeetingCardTest'

export const formSchema = z.object({
    title: z.string(),
    date: z.string().optional(),
    duration: z.string(),
    users: z.string(),
    platform: z.string().optional(),
})

const CreateMeetingList = (groups : any) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-around items-center gap-16 w-full m-4 p-4 lg:px-10">
            <MeetingCardTest title={"Start meeting"} content='Create a meeting that starts now' icon='/icons/add-meeting.svg' cardType="now" bg='bg-blue-500' groups={groups}/>
            <MeetingCardTest title={"Schedule meeting"} content='Schedule a meeting at a determinated date and time' icon='/icons/upcoming.svg' cardType="schedule" bg='bg-red-500' groups={groups} />
            <MeetingCardTest title={"Use group template"} content='Schedule a meeting with a already created group of users' icon='/icons/stars.svg' cardType="template" bg='bg-green-500' groups={groups}/>
        </div>
    )
}

export default CreateMeetingList