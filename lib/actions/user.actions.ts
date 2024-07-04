"use server";

import { revalidatePath } from "next/cache";

import Group from "../models/group.model";
import { connectToDatabase } from "../mongoose";
import { handleError } from "../utils";
import User from "../models/user.model";


// STORES TOKENS, RETURNS CURRENT STATUS
export async function saveTokensToDatabase(email: any, platform: string, access_token: string, refresh_token: string) {
  try {
    await connectToDatabase();

    const currentUser = await User.findOne({ authEmail: email });
    
    let newUser = {
      authEmail: email,
      googleAccessToken: '',
      googleRefreshToken: '',
      zoomAccessToken: '',
      zoomRefreshToken: ''
    };

    //Verifies if user is signing in or signing up. If latests, creates user in db
    if (currentUser) {
      newUser = await JSON.parse(JSON.stringify(currentUser));
    } 

    //Adds new token to user
    if (platform === 'zoom') {
      newUser.zoomAccessToken = access_token;
      newUser.zoomRefreshToken = refresh_token;
    } else {
      newUser.googleAccessToken = access_token;
      newUser.googleRefreshToken = refresh_token;
    }

    //Updates user in db or creates it
    await User.findOneAndUpdate(
      { authEmail: email },
      newUser,
      { upsert: true, new: true }
    ) 

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}