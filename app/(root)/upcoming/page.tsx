//"use client" //REVISAR NO ASYNC IN CLIENT COMPONETNS

import { getAllMeetings } from '@/lib/actions/meeting.actions';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import UpcomingMeetingDetails from '@/components/shared/UpcomingMeetingDetails';

const UpcomingMeetings = async () => {
  const session = await getServerSession(authOptions);

  if(!session) {
    redirect('/')
  }
  const meetings = await getAllMeetings(session.user?.email!)
  const upcomingMeetings = meetings.filter((meet: any) => Date.parse(meet.endDate) > Date.now())
  const meetingsList = upcomingMeetings.map((meet: any) => {
    let dte = new Date(meet.startDate)
    let hours = dte.getHours() > 9 ? dte.getHours() : '0' + dte.getHours()
    let minutes = dte.getMinutes() > 9 ? dte.getMinutes() : '0' + dte.getMinutes()
    return (
      <div key={meet.title} className={`min-h-28 ${meet.platform === 'zoom'? 'bg-blue-700' : 'bg-green-700'} p-4 flex flex-col gap-4 rounded-3xl w-full`}>
        <h1>{meet.title}</h1>
        <h2>{dte.toDateString() + ', ' + hours + ':' + minutes}</h2>
         <UpcomingMeetingDetails oldMeeting={meet}/>
      </div>
    )
  })
  const googleMeetingList = upcomingMeetings.filter((meet: any) => meet.platform === 'meet').map((meet: any) => {
    let dte = new Date(meet.startDate)
    let hours = dte.getHours() > 9 ? dte.getHours() : '0' + dte.getHours()
    let minutes = dte.getMinutes() > 9 ? dte.getMinutes() : '0' + dte.getMinutes()
    return (
      <div key={meet.title} className="min-h-28 bg-green-700 p-4 flex flex-col gap-4 rounded-3xl w-full">
        <h1>{meet.title}</h1>
        <h2>{dte.toDateString() + ', ' + hours + ':' + minutes}</h2>
         <UpcomingMeetingDetails oldMeeting={meet}/>
      </div>
    )
  })
  const zoomMeetingList = upcomingMeetings.filter((meet: any) => meet.platform === 'zoom').map((meet: any) => {
    let dte = new Date(meet.startDate)
    let hours = dte.getHours() > 9 ? dte.getHours() : '0' + dte.getHours()
    let minutes = dte.getMinutes() > 9 ? dte.getMinutes() : '0' + dte.getMinutes()
    return (
      <div key={meet.title} className="min-h-28 bg-blue-700 p-4 flex flex-col gap-4 rounded-3xl w-full">
        <h1>{meet.title}</h1>
        <h2>{dte.toDateString() + ', ' + hours + ':' + minutes}</h2>
         <UpcomingMeetingDetails oldMeeting={meet}/>
      </div>
    )
  })

  //Añadir la opción de editar y ver detalles
  //CRUCIAL PRIORITQARIO: QUE SOLO DEJE INICIAR CON MEET
  return (
    <div className='flex flex-col overflow-hidden my-4 md:my-8 lg:my-12 xl:my-20 mx-4 items-center w-full p-2 m-2 gap-8'>
      <h1 className='text-3xl'>Upcoming Meetings</h1>
      <Tabs defaultValue="all" className="flex flex-col align-center content-center justify-center text-center items-center p-2 w-full">
        <TabsList className='m-8'>
          <TabsTrigger value="all" className='p-4'><div className="flex m-2 gap-2">All</div></TabsTrigger>
          <TabsTrigger value="meet" className='p-4'><div className="flex m-2 gap-2">Meet</div></TabsTrigger>
          <TabsTrigger value="zoom" className='p-4'><div className="flex m-2 gap-2">Zoom</div></TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
          {meetingsList}
        </TabsContent>
        <TabsContent value="meet" className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
          {googleMeetingList}
        </TabsContent>
        <TabsContent value="zoom" className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
          {zoomMeetingList}
        </TabsContent>
      </Tabs>
      {/* <p>{meetingsList}</p>
        <p>No data</p> */}
    </div>
  )
}

export default UpcomingMeetings