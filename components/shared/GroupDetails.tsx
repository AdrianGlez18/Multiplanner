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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn, createMeeting, parseInputDateToMiliseconds } from "@/lib/utils"
import { CustomField } from "./CustomField"
import { useSession } from "next-auth/react"
import { updateGroup } from "@/lib/actions/group.actions"
import { Textarea } from "../ui/textarea"

export const formSchema = z.object({
  title: z.string(),
  users: z.string(),
})

const GroupDetails = ({ _id, title, users, admin, setLoading }: { _id: string, title: string, users: string, admin: string, setLoading: any }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    title: title,
    users: users,
    admin: admin
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setLoading(true)
    const newUserList = values.users.replace(/\s+/g, "").split(',');

    console.log(newUserList)

    const newGroup = {
      _id: _id,
      authEmail: admin,
      groupName: values.title,
      groupEmails: newUserList
    }

    try {

      const updatedGroup = await updateGroup(_id, newGroup);

      console.log(updateGroup)

      if (!updatedGroup) {
        throw new Error("Group could not be updated");
      }

      toast({
        title: 'Updated successfully',
        description: 'Group updated successfully',
        duration: 5000,
        className: 'success-toast'
      })

    } catch (error) {
      toast({
        title: 'Error creating meeting',
        description: 'Please, try again.',
        duration: 5000,
        className: 'success-toast'
      })
    }
    setLoading(false)
    setIsSubmitting(false)
  }
  return (
    <Dialog>
      <DialogTrigger>
        {/* <div
          className={`cursor-pointer ${bg} text-white px-4 py-8 flex flex-col justify-around w-full min-h-[250px] max-w-[600px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
          <div className="flex gap-4">
            <img src={icon} height={30} width={30} alt={title} />
            <h2 className="font-bold text-left mx-4 text-xl">{title}</h2>
          </div>
          <p className="text-left mx-4 text-lg">{content}</p>
        </div> */}
        <Button className="bg-green-500">View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=' flex flex-col items-center justify-around overflow-y-hidden'>
            <h2 className='text-lg xl:text-xl text-center m-2'>
              Group Details
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
                      <Textarea placeholder="me@example.com, you@example.com, he@example.com" id="message" className="col-span-3 w-full px-4 lg:px-8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Update group</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default GroupDetails