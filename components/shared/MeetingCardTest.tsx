"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "../ui/use-toast"

import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
/* import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" */
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMemo, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


import { cn, createMeeting, filterGroupByName, parseInputDateToMiliseconds } from "@/lib/utils"
import { CustomField } from "./CustomField"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Select from 'react-select';

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

  /* let selectorItems: any;
  if (cardType === 'template') {
    selectorItems = useMemo(() => {
      return groups.map((item: any) => (
        <SelectItem key={item._id} value={item.groupName}>{item.groupName}</SelectItem>
      ));
    }, [groups]);
    console.log("MyComponent render");
  } */
  const options = groups.map((item: any) => ({
    value: item.groupName,
    label: item.groupName
  }));


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
    if (!session) {
      redirect('/')
    }

    try {
console.log(groups)
      let startDate = Date.now();
      if (values.date !== undefined) {
        console.log("Using date")
        startDate = parseInputDateToMiliseconds(values.date);
      }
      if (platform === 'zoom') {
        let attendees = session.user?.email?.concat(',', values.users)
        if(cardType === 'template') {
          attendees = session.user?.email?.concat(',', filterGroupByName(groups, values.users))
        }
        const result = await createMeeting(values.title, attendees!, 'zoom', startDate, values.duration, session!.googleRefreshToken!, session!.zoomAccessToken!)
      } else {
        let attendees = session.user?.email?.concat(',', values.users)
        if(cardType === 'template') {
          attendees = session.user?.email?.concat(',', filterGroupByName(groups, values.users))
        }
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
            </Tabs>
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormField
                      control={form.control}
                      name="users"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 col-span-4  items-center gap-4 my-2">
                          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Group</FormLabel>
                          {/* <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a group to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {groups.map((item) => (
                                <SelectItem key={item._id} value={item.groupName} >{item.groupName}</SelectItem>
                              ))}

                            </SelectContent>
                          </Select> */}
                          <Select className="col-span-3"
                            options={options}
                            onChange={(selected) => field.onChange(selected.value)}
                            defaultValue={options.find((option: any) => option.value === field.value)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                cardType === 'schedule' || cardType === 'template' ? (
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