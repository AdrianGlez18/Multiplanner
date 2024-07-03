import Meeting from "@/lib/models/meeting.model";


export async function POST(req, res) {
    try {
        const data = await req.json();
        console.log("Data: ")
        console.log(data)
        const response = await fetch(`https://api.zoom.us/v2/meetings/${data.meetingId}/recordings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.ztoken}`,
                'Content-Type': 'application/json'
            }
        });

        const resdata = await response.json();

        if (resdata.recording_files && resdata.recording_files.length > 0) {
            const recordingLink = resdata.recording_files[0].play_url;
            const updatedMeeting = await Meeting.findOneAndUpdate({
                zoomId: data.meetingId
            }, {
                $set: { recording: recordingLink }
            })
            return new Response(JSON.stringify({ message: "Found!", link: recordingLink }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            const updatedMeeting = await Meeting.findOneAndUpdate({
                zoomId: data.meetingId
            }, {
                $set: { recording: 'No recording available' }
            })
            return new Response(JSON.stringify({ message: "Recording not configured", link: 'No recording available' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } 

    } catch (error) {
        console.error("Error fetching meeting recordings:", error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

