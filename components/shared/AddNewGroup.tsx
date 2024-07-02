"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createGroup } from "@/lib/actions/group.actions"
import { Button } from "../ui/button"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CustomField } from "./CustomField"
import { Input } from "../ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
    title: z.string(),
    users: z.string(),
})

const AddNewGroup = () => {

    const { data: session } = useSession();

    //const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        title: "",
        users: "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        //setIsSubmitting(true);
        if (!session) {
            redirect('/');
        }
        console.log(values)
        const users = values.users.replace(/\s+/g, "").split(',');
        console.log(users)

        const newGroup = {
            authEmail: session.user?.email,
            groupName: values.title,
            groupEmails: users
        }

        const result = await createGroup(newGroup);

        //setIsSubmitting(false)
    }

    return (

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='bg-blue-100 dark:bg-blue-950 col-span-1 flex flex-col items-center justify-around w-full h-screen overflow-y-hidden'>
                    <h2 className='text-lg xl:text-xl text-center m-2'>
                        Add new group
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
                                    <Textarea placeholder="me@example.com, you@example.com, he@example.com" id="message" className="col-span-3 w-full px-4 lg:px-8" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>

                    <Button type="submit">Add new group</Button>
                </form>
            </Form>

    )
}

export default AddNewGroup