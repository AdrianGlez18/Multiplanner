"use client"
//adrianglezhdez18@gmail.com
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
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn, createMeeting, parseInputDateToMiliseconds } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomField } from "./CustomField"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export const formSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  users: z.string(),
  duration: z.string(),
  platform: z.string().optional(),
})

const MeetingCard = ({ bg, icon, title, cardType, content, groups }: { bg: string, icon: string, cardType: string, title: string, content: string, groups: any }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platform, setPlatform] = useState("zoom")
  const { data: session } = useSession();
  console.log(groups)

  const initialValues = {
    title: "",
    date: undefined,
    users: "",
    duration: "30",
    platform: "zoom"
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if(!session) {
      redirect('/')
    }

    try {
      /*  console.log('****************************************************')
       console.log(platform)
       console.log(session) */
      let startDate = Date.now();
      if (values.date !== undefined) {
        console.log("Using date")
        startDate = parseInputDateToMiliseconds(values.date);
      }
      if (platform === 'zoom') {
        //console.log("Platform is zoom. Calling...")
        const attendees = session.user?.email?.concat(',', values.users)
        //console.log("session: #############")
        //console.log(session)
        //const result = await createMeeting(values.title, values.users, 'zoom', session!.zoomRefreshToken!)
        const result = await createMeeting(values.title, attendees!, 'zoom', startDate, values.duration, session!.googleRefreshToken!, session!.zoomAccessToken!)
      } else {
        //console.log("Platform is meet. Calling...")
        const attendees = session.user?.email?.concat(',', values.users)
        const result = await createMeeting(values.title, attendees!, 'meet', startDate, values.duration, session!.googleRefreshToken!, session!.zoomAccessToken!)
      }

      toast({
        title: 'Created successfully',
        description: 'Meeting scheduled successfully',
        duration: 5000,
        className: 'success-toast'
      })

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error creating meeting',
        description: 'Please, try again.',
        duration: 5000,
        className: 'success-toast'
      })
    }

    setIsSubmitting(false)
  }
  return (
    <Dialog>
      <DialogTrigger className="items-center justify-center w-full">
        <div
          className={`cursor-pointer ${bg} text-white px-4 py-8 flex flex-col justify-around w-full min-h-[250px] max-w-[600px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
          <div className="flex gap-4">
            <img src={icon} height={30} width={30} alt={title} />
            <h2 className="font-bold text-left mx-4 text-xl">{title}</h2>
          </div>
          <p className="text-left mx-4 text-lg">{content}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <DialogHeader>
              <DialogTitle>Meeting creation</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="zoom" className="w-full p-2 my-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="zoom"
                  className="bg-blue-300/50 data-[state=active]:text-white data-[state=active]:bg-blue-700 data-[state=active]:scale-105"
                  onClick={() => setPlatform("zoom")}>
                  Zoom
                </TabsTrigger>
                <TabsTrigger
                  value="meet"
                  className="bg-green-300/50 data-[state=active]:text-white data-[state=active]:bg-green-700 data-[state=active]:scale-105"
                  onClick={() => setPlatform("meet")}>
                  Meet
                </TabsTrigger>
              </TabsList>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <CustomField
                    control={form.control}
                    name="title"
                    formLabel="Meeting title"
                    className="grid grid-cols-4 col-span-4 items-center gap-4"
                    render={({ field }) => <Input id="title" {...field} className="col-span-3" />}
                  />

                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <CustomField
                    control={form.control}
                    name="duration"
                    formLabel="Duration (minutes)"
                    className="grid grid-cols-4 col-span-4 items-center gap-4"
                    render={({ field }) => <Input id="title" {...field} className="col-span-3" placeholder="Duration in minutes..." />}
                  />
                </div>
                {
                  cardType === 'template' ? (

                      <FormField
                        control={form.control}
                        name="users"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel>Email</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {
                                  groups.groups.map((item: any) => {
                                    <SelectItem value={item.groupName}>Test</SelectItem>
                                  })
                                }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                  ) : (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <CustomField
                        control={form.control}
                        name="users"
                        formLabel="Users"
                        className="grid grid-cols-4 col-span-4 items-center gap-4"
                        render={({ field }) => <Input id="title" {...field} className="col-span-3" placeholder="Users emails separated by comma..." />}
                      />
                    </div>
                  )
                }
                {
                  cardType === 'schedule' ? (
                    <div className="grid grid-cols-4 items-center gap-4">

                      <CustomField
                        control={form.control}
                        name="date"
                        formLabel="Date"
                        className="grid grid-cols-4 col-span-4 items-center gap-4"
                        render={({ field }) => <Input id="title" {...field} className="col-span-3" placeholder="dd/mm/yyyy, HH:MM" />}
                      />
                    </div>) : ''
                }
              </div>


            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">{isSubmitting ? "Creating Meeting..." : "Create Meeting"}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default MeetingCard