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
import { cn, createMeeting, deleteMeeting, parseInputDateToMiliseconds, parseMilisecondsToInputDate, updateMeeting } from "@/lib/utils"
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

const UpcomingMeetingDetails = ({ oldMeeting/* title, users, duration, startDate */ }: any /* { _id: string, title: string, users: string, duration: string, startDate: any } */) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const oldTitle: string = oldMeeting.title;
  const oldMembers: string = oldMeeting.members;
  const oldDuration = (((new Date(oldMeeting.endDate)).getTime() - (new Date(oldMeeting.startDate)).getTime()) / 60 / 1000).toString();
  const oldDateFormated: string = parseMilisecondsToInputDate(oldMeeting.startDate);


  const initialValues = {
    title: oldTitle,
    users: oldMembers,
    duration: oldDuration,
    date: oldDateFormated
  }

  const handleCancel = async () => {
    setIsLoading(true)
    console.log("Deletion called")
    await deleteMeeting(oldMeeting, session!.googleRefreshToken!, session!.zoomAccessToken!)
    setIsLoading(false)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    let newMeeting = { ...oldMeeting };

    newMeeting.title = values.title;
    newMeeting.members = values.users;
    //newMeeting.duration = values.duration;
    newMeeting.startDate = new Date(parseInputDateToMiliseconds(values.date)).toISOString();
    newMeeting.endDate = new Date(parseInputDateToMiliseconds(values.date) + Number(values.duration) * 60 * 1000).toISOString();
    newMeeting.duration = values.duration;
    try {

      const updatedMeeting = await updateMeeting(newMeeting, session!.googleRefreshToken!, session!.zoomAccessToken!);

      toast({
        title: 'Updated successfully',
        description: 'Meeting updated successfully',
        duration: 5000,
        className: 'success-toast'
      })

    } catch (error) {
      toast({
        title: 'Error updating meeting',
        description: 'Please, try again.',
        duration: 5000,
        className: 'success-toast'
      })
    }

    setIsSubmitting(false)
  }
  const handleJoin = () => {
    window.open(oldMeeting.url, '_blank');
  }

  return (
    <div className="flex m-3 gap-4 justify-around">
    <Dialog>
      <DialogTrigger className="bg-green-200 text-black hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        View Details
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=' flex flex-col items-center justify-around overflow-y-hidden'>
            <h2 className='text-lg xl:text-xl text-center m-2'>
              Meeting Details
            </h2>

            <div className="m-3">
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 col-span-4 items-center gap-4">
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Group name</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='users'
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 col-span-4 items-center gap-4">
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Email list</FormLabel>
                    <FormControl>
                      <Textarea placeholder="me@example.com, you@example.com, he@example.com" id="users" className="col-span-3 w-full px-4 lg:px-8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 col-span-4 items-center gap-4">
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Start Date</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='duration'
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 col-span-4 items-center gap-4">
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full justify-around my-4">
              <Button onClick={handleJoin}>Join now</Button>
              <DialogClose asChild>
              <Button type="submit">Update Meeting</Button>
              </DialogClose>

            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
    <Button onClick={handleCancel} className="bg-red-200 text-black">Cancel</Button>
    </div>
  )
}

export default UpcomingMeetingDetails