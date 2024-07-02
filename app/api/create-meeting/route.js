const { google } = require('googleapis');
import { storeMeetingInDB, updateMeetingInDB, deleteMeetingFromDB } from '@/lib/actions/meeting.actions';

export async function POST(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  )
  const data = await req.json();

  try {
    oauth2Client.setCredentials({ refresh_token: data.token })
    const calendar = google.calendar('v3')
    const attendeesMails = data.people.replace(' ', '').split(',')
    let attendees = []
    attendeesMails.map(mail => {
      attendees.push({
        "email": mail
      })
    })
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: data.title,
        description: data.users,
        location: "location",
        colorId: '6',
        start: {
          'dateTime': new Date(data.startDate).toISOString(),//'2024-06-25T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        end: {
          'dateTime': new Date(data.startDate + data.duration * 60 * 1000).toISOString(),
          'timeZone': 'America/Los_Angeles',
        },
        attendees: attendees,/* [
                {'email': 'adrianglezhdez18@gmail.com'},
                {'email': 'adriangh18@gmail.com'},
              ], */
        conferenceData: {
          createRequest: {
            requestId: Math.random().toString(36).slice(2),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },

      }
    })

    console.log(response.data)
    const admin = data.people.split(',')[0]
    const newMeeting = {
      authEmail: admin,
      platform: data.platform,
      title: data.title,
      description: data.description | '',
      url: response.data.hangoutLink,
      members: data.people,
      startDate: Date.now(),
      endDate: Date.now() + data.duration * 60 * 1000,
      calendarId: response.data.id
    }

    const storedMeeting = await storeMeetingInDB(newMeeting);
    console.log("Added to db")
    return new Response(JSON.stringify({ message: "Created!", link: response.data.hangoutLink }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log(error)
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req, res) {
  console.log("PUT")
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  )
  console.log("auth")
  const data = await req.json();

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
    calendarId: data.calendarId
  }

  try {
    oauth2Client.setCredentials({ refresh_token: data.gtoken })
    const calendar = google.calendar('v3')
    console.log("calendar")
    const attendeesMails = data.members.replace(' ', '').split(',')
    let attendees = []
    attendeesMails.map(mail => {
      attendees.push({
        "email": mail
      })
    })
    console.log(attendees)
    const response = await calendar.events.update({
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
    console.log("response")
    console.log(response)
    const storedMeeting = await updateMeetingInDB(newMeeting);
    return new Response(JSON.stringify({ message: "Updated!", link: response.data.hangoutLink }), {
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
    oauth2Client.setCredentials({ refresh_token: data.gtoken })
    const calendar = google.calendar('v3')
    const response = await calendar.events.delete({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: data.calendarId,
    })
    const storedMeeting = await deleteMeetingFromDB(data._id);
    return new Response(JSON.stringify({ message: "Deleted!"}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log(error)
    return new Response('Internal Server Error', { status: 500 });
  }

}
