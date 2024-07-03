import PreviousMeetingDetails from './PreviousMeetingDetails'
import { getMeetingRecording } from '@/lib/utils'

const PreviousMeetingCard = async ({ meet, token }: any) => {

    let recording: any = meet.recording;
    console.log("recording", recording)
    if (recording === 'Pending...') {
        recording = await getMeetingRecording(meet, token);
    } 
    console.log("recording", recording)

    let dte = new Date(meet.startDate)
    let hours = dte.getHours() > 9 ? dte.getHours() : '0' + dte.getHours()
    let minutes = dte.getMinutes() > 9 ? dte.getMinutes() : '0' + dte.getMinutes()
    return (
        <div key={meet._id} className="min-h-28 bg-blue-700 p-4 flex flex-col gap-4 rounded-3xl w-full">
            <h1>{meet.title}</h1>
            <h2>{dte.toDateString() + ', ' + hours + ':' + minutes}</h2>
            <PreviousMeetingDetails oldMeeting={meet}/>
        </div>
    )
}

export default PreviousMeetingCard