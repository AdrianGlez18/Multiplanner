//const { SpacesServiceClient } = require('@google-apps/meet').v2;

import Meeting from "../models/meeting.model";
import { connectToDatabase } from "../mongoose";

export async function storeMeetingInDB(meeting: any) {
    try {
        await connectToDatabase();
        meeting.recording = "Pending..."
        console.log("meeting just before creation")
        console.log(meeting)
        const newMeeting = await Meeting.create(meeting);
        console.log("New meeting created")

        return JSON.parse(JSON.stringify(newMeeting));
    } catch (error) {
        console.error(error);
    }
}

export async function updateMeetingInDB(newMeeting: any) {
    try {
        console.log("Conecting to db in update....")
        await connectToDatabase();
        console.log("Connected  to db in update....")
        const updatedMeeting = await await Meeting.findOneAndUpdate({ _id: newMeeting._id }, newMeeting, {
            upsert: true, new: true
        });

        console.log("Meeting updated")

        return JSON.parse(JSON.stringify(updatedMeeting));
    } catch (error) {
        console.error(error);
    }
}

export async function deleteMeetingFromDB(_id: string) {
    try {
        await connectToDatabase();

        const deletedMeeting = await Meeting.deleteOne({_id: _id});
        console.log("Meeting deleted")

        return JSON.parse(JSON.stringify(deletedMeeting));
    } catch (error) {
        console.error(error);
    }
}

export async function getAllMeetings(userId: string) {
    try {
        console.log(userId)
        await connectToDatabase();

        const meeting = await Meeting.find({ authEmail: userId });

        return JSON.parse(JSON.stringify(meeting));
    } catch (error) {
        console.error(error);
    }
}

export async function findMeetingAndInsertRecording(newMeeting: any) {
    try {
        console.log("Conecting to db in update....")
        await connectToDatabase();
        console.log("Connected  to db in update....")
        const updatedMeeting = await await Meeting.findOneAndUpdate({ _id: newMeeting._id }, newMeeting, {
            upsert: true, new: true
        });

        console.log("Meeting updated")

        return JSON.parse(JSON.stringify(updatedMeeting));
    } catch (error) {
        console.error(error);
    }
}