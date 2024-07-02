import GroupCards from "@/components/shared/GroupCards";
import { useSession } from "next-auth/react";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from "next-auth/next"
import { getGroupsByUser } from "@/lib/actions/group.actions";
import { redirect } from "next/navigation";
import AddNewGroup from "@/components/shared/AddNewGroup";

const Group = async () => {

  const session = await getServerSession(authOptions)
  if (!session) redirect("/");
  let groups = await getGroupsByUser(session?.user?.email!)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
      <div className='col-span-1 lg:col-span-2 flex flex-col gap-4 items-center justify-center w-full h-screen overflow-y-hidden'>
        <h1 className='text-lg xl:text-2xl text-center m-2'>
          User groups
        </h1>
        <GroupCards groups={groups} />

      </div>
      <AddNewGroup />
    </div>
  )
}

export default Group