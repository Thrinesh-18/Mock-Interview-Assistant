"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'
import Link from 'next/link'

function Interview() {
  const {interviewId}=useParams();
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
        <h2 className='font-semibold text-2xl'>Want to send interview link to someone?</h2>
        <div className='flex gap-5 w-full items-center max-w-md'>
          <Input placeholder='Enter email address' className='w-full max-w-xl m-2'/>
          <Button><Send/></Button>
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Interview