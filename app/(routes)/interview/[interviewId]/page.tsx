"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import SendInterviewEmail from "@/components/SendInterviewEmail"
import { Id } from "@/convex/_generated/dataModel";

function Interview() {
  const {interviewId}=useParams();
  const { user } = useUser()
  const interview = useQuery(api.Interview.GetInterviewQuestions, { interviewRecordId: interviewId as Id<"InterviewSessionTable"> })
  if (!interview || !user) return null
  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <div>
      <Image src='/interview.png' alt='interview illustration' width={400} height={200}
      className='w-full h-[380px]  justify-center object-contain'
      />
      <div className='p-6 flex flex-col items-center space-y-5'>
        <h2 className='font-bold text-3xl text-center'>Ready to Start Interview</h2>
        <p className='text-center text-gray-500'>
          Click Start Interview below to get started.
        </p>
        <Link href={`/interview/${interviewId}/start`}>
         <Button>Start Interview <ArrowRight /></Button>
        </Link>
       

        <hr />
        <div className='p-6 bg-blue-100 rounded-2xl'>
          <h2 className='font-semibold text-2xl mb-4'>Want to send interview link to someone?</h2>
          <SendInterviewEmail 
            interviewId={interview._id}
            senderName={user.fullName ?? user.primaryEmailAddress?.emailAddress ?? ""}
            senderEmail={user.primaryEmailAddress?.emailAddress ?? ""}
          />
        </div>
      </div>
      </div>
    </div>
  )
}

export default Interview