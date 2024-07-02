"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { deleteGroup } from "@/lib/actions/group.actions";
import GroupDetails from "./GroupDetails";

const GroupCard = (group: any/* , refreshGroupList: any */) => {
    const [loading, setLoading] = useState(false);

    console.log("Group in groupcard:")
    console.log(group.group._id)
    console.log(group)

    //Display only first 5 elements
    const membersArrayReduced: string[] = group.group.groupEmails.slice(0, 5);
    let groupMembers: string = membersArrayReduced.join(', ');

    if (group.group.groupEmails.length > 5) {
        groupMembers += '...';
    }

    const handleDelete = async () => {
        setLoading(true);
        await deleteGroup(group.group._id);
        setLoading(false);
        //refreshGroupList();
    }
    return (
        <div className='bg-blue-300 dark:bg-blue-950 w-full my-4 flex flex-col items-center content-center justify-around p-8 rounded-3xl gap-4'>
            <h2>{group.group.groupName}</h2>
            <p>{groupMembers}</p>
            <div className="flex justify-around w-full">
                {/* <Button className="bg-green-500">View Details</Button> */}
                <GroupDetails _id={group.group._id} title={group.group.groupName} admin={group.group.authEmail} users={group.group.groupEmails.join(', ')} setLoading={setLoading}/>
                <Button onClick={handleDelete} className="bg-red-500">Delete Group</Button>
            </div>
        </div>
    )
}

export default GroupCard