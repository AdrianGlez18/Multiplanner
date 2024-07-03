import { storeMeetingInDB, deleteMeetingFromDB, updateMeetingInDB } from '@/lib/actions/meeting.actions';


export async function DELETE(req, res) {
  const data = await req.json();
  try {
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
