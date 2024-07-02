"use server";

import { revalidatePath } from "next/cache";

import Group from "../models/group.model";
import { connectToDatabase } from "../mongoose";
import { handleError } from "../utils";

// CREATE
export async function createGroup(group: any) {
  try {
    await connectToDatabase();

    const newGroup = await Group.create(group);
    console.log("New group created")

    return JSON.parse(JSON.stringify(newGroup));
  } catch (error) {
    handleError(error);
  }
}

// GET
export async function getGroupsByUser(userId: string) {
  try {
    await connectToDatabase();

    const group = await Group.find({ authEmail: userId });
    //if (!group) throw new Error("Group not found");

    return JSON.parse(JSON.stringify(group));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateGroup(_id: string, group: any) {
  try {
    await connectToDatabase();
    console.log("Connected to db")
    console.log(_id)
    console.log(group)
    const updatedGroup = await Group.findOneAndUpdate({ _id }, group, {
      new: true,
    });

    if (!updatedGroup) throw new Error("Group update failed");
    
    return JSON.parse(JSON.stringify(updatedGroup));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteGroup(_id: string) {
  try {
    await connectToDatabase();

    //const groupToDelete = await Group.findOne({ _id });
    const deletedGroup = await Group.findByIdAndDelete(_id);

    if (!deletedGroup) {
      throw new Error("Group not found");
    }

    //const deletedGroup = await Group.findByIdAndDelete(groupToDelete._id);
    revalidatePath("/");

    return deletedGroup ? JSON.parse(JSON.stringify(deletedGroup)) : null;
  } catch (error) {
    handleError(error);
  }
}
