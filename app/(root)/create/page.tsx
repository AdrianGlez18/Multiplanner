import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateMeetingList from "@/components/shared/CreateMeetingList"
import { getGroupsByUser } from "@/lib/actions/group.actions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


const PlanAMeeting = async () => {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/");
    let groups = await getGroupsByUser(session?.user?.email!)
    return (
        <div className='flex min-h-screen flex-col items-center justify-center w-full gap-8'>
            <h2 className='text-center text-4xl'>Plan A Meeting</h2>
            <h3 className='text-center text-2xl'>Select the type of meeting</h3>
            <CreateMeetingList groups={groups}/>
        </div>
    )
}

export default PlanAMeeting