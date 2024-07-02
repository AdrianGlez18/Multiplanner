const { google } = require('googleapis');
import { storeMeetingInDB, deleteMeetingFromDB, updateMeetingInDB } from '@/lib/actions/meeting.actions';

export async function POST(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  )
  const data = await req.json();
  console.log(data)

  try {
    oauth2Client.setCredentials({ refresh_token: data.gtoken })
    const calendar = google.calendar('v3')
    const attendeesMails = data.people.replaceAll(' ', '').split(',')
    //const adminEmail = attendeesMails.shift()
    let attendees = []
    attendeesMails.map(mail => {
      attendees.push({
        "email": mail
      })
    })

    console.log(attendees);

    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify({
        topic: data.title,
        type: 2, // Scheduled meeting
        start_time: new Date(data.startDate).toISOString(),
        duration: data.duration,
        registrants: attendees,
        meeting_invitees: attendees,
        registrants_confirmation_email: true,
        registrants_email_notification: true,
        settings: {
          approval_type: 0, // Automatically send emails
          registration_type: 1, // Register once and attend any of the occurrences
        },
      }),
    });
    console.log(response)
    if (!response.ok) {
      console.log("Failed to schedule meeting")
      //res.status(response.status).json({ message: "Failed to schedule meeting" });
      return;
    }

    const resdata = await response.json();
    console.log(resdata)
    //res.status(200).json(resdata);

    const gresponse = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: data.title,
        description: "Zoom meeting",
        location: resdata.join_url,
        start: {
          'dateTime': new Date(data.startDate).toISOString(),//'2024-06-25T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        end: {
          'dateTime': new Date(data.startDate + data.duration * 60 * 1000).toISOString(),
          'timeZone': 'America/Los_Angeles',
        },
        attendees: attendees,
      }
    })
    console.log("inserted")
    //console.log(response.data.hangoutLink)
    const admin = data.people.split(',')[0]
    const newMeeting = {
      authEmail: admin,
      platform: data.platform,
      title: data.title,
      description: data.description | '',
      url: resdata.start_url,//response.data.hangoutLink,
      members: data.people,
      startDate: data.startDate,
      endDate: data.startDate + data.duration * 60 * 1000,
      calendarId: gresponse.data.id,
      zoomId: resdata.id
    }

    const storedMeeting = await storeMeetingInDB(newMeeting);
    return new Response(JSON.stringify({ message: "Created!", link: resdata.start_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log(error)
  }
}

export async function PUT(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  )
  const data = await req.json();
  console.log("data in api:")
  console.log(data)
  try {
    oauth2Client.setCredentials({ refresh_token: data.gtoken })
    const calendar = google.calendar('v3')
    const attendeesMails = data.members.replaceAll(' ', '').split(',')
    const adminEmail = attendeesMails.shift()
    let attendees = []
    attendeesMails.map(mail => {
      attendees.push({
        "email": mail
      })
    })
    console.log("before fetch zoom")

     const response = await fetch(`https://api.zoom.us/v2/meetings/${data.zoomId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.ztoken}`,
      },
      body: JSON.stringify({
        topic: data.title,
        type: 2,
        start_time: new Date(data.startDate).toISOString(),
        duration: data.duration,
        meeting_invitees: attendees,
        registrants_confirmation_email: true,
        registrants_email_notification: true
      }),
    });

    console.log("after fetch zoom")
    console.log(response)

    if (!response.ok) {
      console.log("Failed to schedule meeting")
      return;
    }

    /* const resdata = await response.json();
    console.log(resdata)  */
    //res.status(200).json(resdata);

    const gresponse = await calendar.events.update({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: data.calendarId,
      resource: {
        summary: data.title,
        start: {
          'dateTime': new Date(data.startDate).toISOString(),//'2024-06-25T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        end: {
          'dateTime': new Date(data.endDate).toISOString(),
          'timeZone': 'America/Los_Angeles',
        },
        attendees: attendees,
      }
    })

    console.log("gresponse")
    console.log(gresponse)

    const newMeeting = {
      _id: data._id,
      authEmail: data.authEmail,
      description: data.description,
      endDate: data.endDate,
      members: data.members,
      platform: data.platform,
      startDate: data.startDate,
      title: data.title,
      url: data.url,
      users: data.users,
      calendarId: data.calendarId,
      zoomId: data.zoomId
    }

    console.log("Before updating in db")

    const storedMeeting = await updateMeetingInDB(newMeeting);
    return new Response(JSON.stringify({ message: "Updated!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.log(error)
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req, res) {
  console.log("DELETE")
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  )
  console.log("Inside deletion api")
  const data = await req.json();
  try {
    //DELETE FROM ZOOM
    const zoomResponse = await fetch(`https://api.zoom.us/v2/meetings/${data.zoomId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${data.ztoken}`,
      },
    });
    //DELETE FROM CALENDAR
    oauth2Client.setCredentials({ refresh_token: data.gtoken })
    const calendar = google.calendar('v3')
    const response = await calendar.events.delete({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: data.calendarId,
    })
    const storedMeeting = await deleteMeetingFromDB(data._id);
    return new Response(JSON.stringify({ message: "Deleted!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log(error)
    return new Response('Internal Server Error', { status: 500 });
  }

}
