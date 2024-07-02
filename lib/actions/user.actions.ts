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

    console.log("Current User: ")
    console.log(currentUser)
    
    let newUser = {
      authEmail: email,
      googleAccessToken: '',
      googleRefreshToken: '',
      zoomAccessToken: '',
      zoomRefreshToken: ''
    };

    console.log("Before updating tokens in savetokens")
    console.log(newUser)

    //Verifies if user is signing in or signing up. If latests, creates user in db
    if (currentUser) {
      newUser = await JSON.parse(JSON.stringify(currentUser));
    } /* else {

      newUser.authEmail = email;
      newUser.googleAccessToken = '';
      newUser.googleRefreshToken = '';
      newUser.zoomAccessToken = '';
      newUser.zoomRefreshToken = '';

    } */

    

    //Adds new token to user
    if (platform === 'zoom') {
      newUser.zoomAccessToken = access_token;
      newUser.zoomRefreshToken = refresh_token;
    } else {
      newUser.googleAccessToken = access_token;
      newUser.googleRefreshToken = refresh_token;
    }

    console.log("inside saveTokens")
    console.log(newUser)

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