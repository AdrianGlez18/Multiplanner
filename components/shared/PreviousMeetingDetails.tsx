"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "../ui/use-toast"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { cn, createMeeting, deleteMeeting, deletePreviousMeeting, parseInputDateToMiliseconds, parseMilisecondsToInputDate, updateMeeting } from "@/lib/utils"
import { CustomField } from "./CustomField"
import { useSession } from "next-auth/react"
import { updateGroup } from "@/lib/actions/group.actions"
import { Textarea } from "../ui/textarea"


export const formSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  users: z.string(),
  duration: z.string(),
})

const PreviousMeetingDetails = ({ oldMeeting }: any /* { _id: string, title: string, users: string, duration: string, startDate: any } */) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const oldTitle: string = oldMeeting.title;
  const oldMembers: string = oldMeeting.members;
  const oldDuration = (((new Date(oldMeeting.endDate)).getTime() - (new Date(oldMeeting.startDate)).getTime()) / 60 / 1000).toString();
  const oldDateFormated: string = parseMilisecondsToInputDate(oldMeeting.startDate);

console.log("previous recording", oldMeeting.recording)
  const initialValues = {
    title: oldTitle,
    users: oldMembers,
    duration: oldDuration,
    date: oldDateFormated
  }

  const handleCancel = async () => {
    setIsLoading(true)
    console.log("Deletion called")
    await deletePreviousMeeting(oldMeeting)
    setIsLoading(false)
  }

  return (
    <div className="flex m-3 gap-4 justify-around">
    <Dialog>
      <DialogTrigger className="bg-green-200 text-black hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        View Details
      </DialogTrigger>
      <DialogContent>
        <p>Attendees:</p>
        <ol className='list-decimal list-inside p-2'>
          {oldMembers.replace(' ', '').split(',').map((user: string) => (
            <li key={user}>{user}</li>
          ))}
        </ol> 
        <p>Scheduled duration: {oldDuration} minutes</p>
        <p>Recording: {oldMeeting.recording}</p>
      </DialogContent>
    </Dialog >
    <Button onClick={handleCancel} className="bg-red-200 text-black">Cancel</Button>
    </div>
  )
}

export default PreviousMeetingDetails