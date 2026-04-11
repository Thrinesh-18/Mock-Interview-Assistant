"use client"
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import CreateInterviewDialog from '../_components/CreateInterviewDialog';
import { useConvex } from 'convex/react';
import { UserDetailContext } from '@/context/UserDetailContext';

import { GetInterviewList } from '@/convex/Interview';
import { api } from '@/convex/_generated/api';
import { InterviewData } from '../interview/[interviewId]/start/page';
import EmptyState from './_components/EmptyState';
import InterviewCard from './_components/InterviewCard';
import { Skeleton } from '@/components/ui/skeleton';


function DashBoard() {
  const { user } = useUser();
  const [interviewList, setInterviewsList] = useState<InterviewData[]>([]);
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const convex=useConvex();
  const [loading,setloading]=useState(true);

  const GetInterviewList=useCallback(async()=>{
    setloading(true);
    const result=await convex.query(api.Interview.GetInterviewList,{
      uid:userDetail._id
    })
    console.log(result);
    const transformedResult = result.map(interview => ({
      ...interview,
      jobTitle: interview.jobTitle ?? null,
      jobDescription: interview.jobDescription ?? null
    }));
    setInterviewsList(transformedResult);
    setloading(false);
  },[convex, userDetail?._id])

  useEffect(()=>{
    if(userDetail) {
      setloading(true);
      GetInterviewList();
    }
  },[userDetail, GetInterviewList])
  return (
    <div className='py-20 px-10 md:px-28 lg:px-44 xl:px-56'>
      <div className='flex items-center justify-between'>
      <div>
         <h2 className='text-lg text-gray-500'>My Dashboard</h2>
      <h2 className='text-3xl font-bold'>Welcome, {user?.fullName}</h2>
      </div>
      <CreateInterviewDialog />
     </div>
     {loading ? (
       <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
         {[1,2,3,4,5].map((item,index)=>(
            <div className="flex flex-col space-y-3" key={index}>
         <Skeleton className="h-[125px] w-full rounded-xl bg-gray-200" />
         <div className="space-y-2">
           <Skeleton className="h-4 w-[250px] bg-gray-200" />
           <Skeleton className="h-4 w-[200px] bg-gray-200" />
         </div>
       </div>
         ))}
        </div>
     ) : interviewList.length == 0 ? (
       <EmptyState />
     ) : (
       <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
         {interviewList.map((interview,index)=>(
           <InterviewCard interviewInfo={interview} key={index}/>
         ))}
       </div>
     )}
    </div>
  )
}

export default DashBoard