"use server";

import { revalidatePath } from "next/cache";

import Group from "../models/group.model";
import { connectToDatabase } from "../mongoose";
import { handleError } from "../utils";
import User from "../models/user.model";
import { getAllMeetings } from "./meeting.actions";
import Analytics from "../models/analytics.model";

export async function getAnalytics(userId: string) {
  try {
    await connectToDatabase();

    const analytics = await Analytics.findOne({ authEmail: userId });

    return JSON.parse(JSON.stringify(analytics));

  } catch (error) {
    handleError(error);
  }
}

export async function initializeAnalytics(userId: string) {
  try {
    console.log("initialize analytics...")
    await connectToDatabase();

    const userMeetings = await getAllMeetings(userId) //User.findOne({ authEmail: userId });
    const previousMeetings = userMeetings.filter((meet: any) => Date.parse(meet.endDate) < Date.now())
    console.log("Previous meetings")

    let zoomMeetings = 0,
      meetMeetings = 0,
      averageUsers = 0,
      averageUsersMeet = 0,
      averageUsersZoom = 0,
      averageDuration = 0,
      averageDurationZoom = 0,
      averageDurationMeet = 0,
      auxZoomDuration = 0,
      auxMeetDuration = 0,
      auxZoomUsers = 0,
      auxMeetUsers = 0,
      auxDate1: any = 0,
      auxDate2: any = 0;

    previousMeetings.map((currentMeeting: any) => {
      if (currentMeeting.platform === 'zoom') {
        zoomMeetings++;
        auxDate1 = new Date(currentMeeting.endDate);
        auxDate2 = new Date(currentMeeting.startDate);
        auxZoomDuration += (auxDate1 - auxDate2);
        auxZoomUsers += currentMeeting.members.split(',').length;
      } else {
        meetMeetings++;
        auxDate1 = new Date(currentMeeting.endDate);
        auxDate2 = new Date(currentMeeting.startDate);
        auxMeetDuration += (auxDate1 - auxDate2);
        
        auxMeetUsers += currentMeeting.members.split(',').length;
        
      }
    })

    console.log("iteration completed")

    averageUsersMeet = Number((auxMeetUsers / meetMeetings).toFixed(2));
    averageUsersZoom = Number((auxZoomUsers / zoomMeetings).toFixed(2));
    averageUsers = Number((((zoomMeetings * averageUsersZoom) + (meetMeetings * averageUsersMeet)) / (zoomMeetings + meetMeetings)).toFixed(2));

    averageDurationMeet = Number(((auxMeetDuration / meetMeetings) / 1000 / 60).toFixed(2));
    averageDurationZoom = Number(((auxZoomDuration / zoomMeetings) / 1000 / 60).toFixed(2));
    averageDuration = Number((((zoomMeetings * averageDurationZoom) + (meetMeetings * averageDurationMeet)) / (zoomMeetings + meetMeetings)).toFixed(2));


    const currentUserAnalytics = {
      authEmail: userId,
      zoomScheduled: zoomMeetings,
      meetScheduled: meetMeetings,
      averageUsers: averageUsers,
      averageUsersZoom: averageUsersZoom,
      averageUsersMeet: averageUsersMeet,
      averageDuration: averageDuration,
      averageDurationZoom: averageDurationZoom,
      averageDurationMeet: averageDurationMeet,
      zoomRecordings: 0,
      meetRecordings: 0
    }

    console.log("CurrentUserAnalytics: ")
    console.log(currentUserAnalytics)

    const storedAnalytics = await Analytics.findOneAndUpdate({ authEmail: userId }, currentUserAnalytics, {
       upsert: true, new: true 
    });

    console.log(storedAnalytics)

    return JSON.parse(JSON.stringify(storedAnalytics));
  } catch (error) {
    handleError(error);
  }
}