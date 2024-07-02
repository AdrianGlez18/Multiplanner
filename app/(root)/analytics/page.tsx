import React, { useEffect } from 'react';
import Bars from '@/components/graphs/Bars';
import CircleGraph from '@/components/graphs/CircleGraph';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import { getAnalytics, initializeAnalytics } from '@/lib/actions/analytics.actions';
import { Button } from '@/components/ui/button';


const Analytics = async () => {

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/');
  }

  console.log("Debugging Analyticas: ")
  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")

  let currentAnalytics = await getAnalytics(session.user?.email);
  console.log(currentAnalytics)

  const totalMeetings = currentAnalytics.zoomScheduled + currentAnalytics.meetScheduled;
  const meetingsRecorded = currentAnalytics.zoomRecordings + currentAnalytics.meetRecordings;

  if (!currentAnalytics) {
    console.log("!current")
    console.log(session.user.email)
    await initializeAnalytics(session.user.email);
    currentAnalytics = await getAnalytics(session.user?.email);
    console.log(currentAnalytics)
  }

  const meetingsData = {
    labels: ["Zoom", "Google Meet"],
    datasets: [
      {
        label: "Meetings",
        data: [currentAnalytics.zoomScheduled, currentAnalytics.meetScheduled],
        backgroundColor: ["blue", "green"],
      }
    ]
  }

  const durationData = {
    labels: ["General", "Zoom", "Google Meet"],
    datasets: [
      {
        label: "Duration in minutes",
        data: [currentAnalytics.averageDuration, currentAnalytics.averageDurationZoom, currentAnalytics.averageDurationMeet],
        backgroundColor: ["yellow", "blue", "green"],
      }
    ]
  }

  const usersData = {
    labels: ["General", "Zoom", "Google Meet"],
    datasets: [
      {
        label: "Invited users",
        data: [currentAnalytics.averageUsers, currentAnalytics.averageUsersZoom, currentAnalytics.averageUsersMeet],
        backgroundColor: ["yellow", "blue", "green"],
      }
    ]
  }

  return (
    <div className='flex flex-col gap-4 w-full px-8 items-center justify-center overflow-hidden'>
      <div className="flex w-full">
        <div className="flex justify-around w-full">
          <h1 className='font-extrabold text-lg xl:text-3xl'>Analytics</h1>
          {/* <p className='font-extrabold text-md xl:text-xl'>Last update today</p> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 lg:gap-8">
        <div className="flex w-full items-center content-center justify-center">
          <div className="flex flex-col p-4 gap-4 max-w-[600px] bg-blue-950 rounded-3xl m-8">
            <p className='mx-8 my-4 text-lg xl:text-2xl'>Total meetings: {totalMeetings}</p>
            <p className='mx-8 my-4 text-lg xl:text-2xl'>Meetings recorded: {meetingsRecorded}</p>
            <p className='mx-8 my-4 text-lg xl:text-2xl'>Last updated: {meetingsRecorded}</p>
            <Button>Update Analytics</Button>
          </div>
        </div>
        <div className="flex justify-center gap-4 w-full">
          <div className="flex flex-col">
            <h2 className='font-extrabold text-md xl:text-xl my-4 text-center'>Total meetings by platform</h2>
            <CircleGraph data={meetingsData} />
          </div>
        </div>
        <div className="flex justify-center gap-4 w-full">
          <div className="flex flex-col w-full">
            <h2 className='font-extrabold text-md xl:text-xl my-4 text-center'>Average users per meeting</h2>
            <div className="flex flex-col lg:px-16 w-full items-center content-center">
              <Bars data={usersData} />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 w-full">
          <div className="flex flex-col w-full">
            <h2 className='font-extrabold text-md xl:text-xl my-4 text-center'>Average meetings duration</h2>
            <div className="flex flex-col lg:px-16 w-full items-center content-center">
              <Bars data={durationData} />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Analytics;


//Por defecto vacias. Aparecerá un texto indicando la ultima vez que se actualizaron.
//Se obtendrán los datos del objeto estadisticas de la base de datos.
//Al actualizarlas, recorrerá el objeto meetings para las previas.
//Aquellas que no hayan almacenado datos estadísticos, harán una petición y guararan la informacion para no tener que repetirlas
//Cuando todas estén actualizadas, se actualzia también el objeto estadísticas, con la fecha de actualizacion
//Se muestran los gráficos
//Las estadisticas también se actualizan cada vez que se marca ver detalles de una reunión

{/* <div className="flex w-full">
        <div className="flex justify-center gap-4 w-full">
          <div className="flex flex-col">
            <h2 className='font-extrabold text-md xl:text-xl my-4 text-center'>Total meetings by platform</h2>
            <CircleGraph data={meetingsData} />
          </div>
        </div>
        <div className="flex justify-center gap-4 w-full">
          <div className="flex flex-col w-full">
            <h2 className='font-extrabold text-md xl:text-xl my-4 text-center'>Average meetings duration</h2>
            <Bars data={durationData} />
          </div>
        </div>
      </div> */}