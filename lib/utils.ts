import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
/* const { SpacesServiceClient } = require('@google-apps/meet').v2; */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export const createMeeting = async (title: string, people: string, platform: string, startDate: number, duration: string, gtoken: string, ztoken: string) => {

  let response;
  if (platform === "meet") {
    response = await fetch('/api/create-meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, people: people, token: gtoken, startDate: startDate, duration: duration, platform: platform })
    })

    if (startDate <= Date.now()) {
      const resdata = await response.json()
      window.open(resdata.link, '_blank');
    }
  } else {
    response = await fetch('/api/create-zoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, people: people, token: ztoken, gtoken: gtoken, startDate: startDate, duration: duration, platform: platform })
    })

     if (startDate <= Date.now()) {
      const resdata = await response.json()
      window.open(resdata.link, '_blank');
    } 
  }
}

export const updateMeeting = async (newMeeting: any, gtoken: string, ztoken: string) => {

  let response;
  console.log("inside updateMeeting")
  console.log(newMeeting)
  if (newMeeting.platform === "meet") {
    console.log("Meet")
    response = await fetch('/api/create-meeting', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: newMeeting._id,
        authEmail: newMeeting.authEmail,
        description: newMeeting.description,
        endDate: newMeeting.endDate,
        members: newMeeting.members,
        platform: newMeeting.platform,
        startDate: newMeeting.startDate,
        duration: newMeeting.duration,
        title: newMeeting.title,
        url: newMeeting.url,
        users: newMeeting.users,
        calendarId: newMeeting.calendarId,
        gtoken: gtoken,
        ztoken: ztoken
      })
    })

    if (newMeeting.startDate <= Date.now()) {
      const resdata = await response.json()
      window.open(resdata.link, '_blank');
    }
  } else {
    console.log("Zoom")
    response = await fetch('/api/create-zoom', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: newMeeting._id,
        authEmail: newMeeting.authEmail,
        description: newMeeting.description,
        endDate: newMeeting.endDate,
        members: newMeeting.members,
        platform: newMeeting.platform,
        startDate: newMeeting.startDate,
        duration: newMeeting.duration,
        title: newMeeting.title,
        url: newMeeting.url,
        users: newMeeting.users,
        calendarId: newMeeting.calendarId,
        zoomId: newMeeting.zoomId,
        gtoken: gtoken,
        ztoken: ztoken
      })
    })
    console.log("after await fetch in updateMeeting")
    /* if (newMeeting.startDate <= Date.now()) {
      const resdata = await response.json()
      window.open(resdata.start_link, '_blank');
    } */
  }
}

export const deleteMeeting = async (oldMeeting: any, gtoken: string, ztoken: string) => {

  let response;
  if (oldMeeting.platform === "meet") {
    console.log("Meet")
    response = await fetch('/api/create-meeting', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: oldMeeting._id,
        authEmail: oldMeeting.authEmail,
        calendarId: oldMeeting.calendarId,
        gtoken: gtoken,
        ztoken: ztoken
      })
    })
  } else {
    console.log("Zoom")
    response = await fetch('/api/create-zoom', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: oldMeeting._id,
        authEmail: oldMeeting.authEmail,
        calendarId: oldMeeting.calendarId,
        zoomId: oldMeeting.zoomId,
        gtoken: gtoken,
        ztoken: ztoken
      })
    })
  }
}

export const parseInputDateToMiliseconds = (inputDate: string = parseMilisecondsToInputDate(Date.now())) => {

  const [datePart, timePart] = inputDate.split(', ');
  let [day, month, year] = datePart.split('/').map(Number);
  let [hours, minutes] = timePart.split(':').map(Number);
  let newDate;

  hours -= 1; //UTC

  if (hours < 0) {
    hours = 23;
    day -= 1;

    if (day < 1) {
      month -= 1;
    }

    if (month < 1) {
      year -= 1;
    }
  }

  newDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return newDate.getTime();

}

export const parseMilisecondsToInputDate = (miliseconds: number) => {
  const date = new Date(miliseconds);
  return date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
