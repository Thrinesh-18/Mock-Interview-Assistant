"use client";
import { api } from '@/convex/_generated/api';
import axios from 'axios';
import { useConvex } from 'convex/react';
import { tspan, video } from 'motion/react-client';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { GenericAgoraSDK } from 'akool-streaming-avatar-sdk';
import { Button } from '@/components/ui/button';

type interviewData={
  jobTitle:string|null,
  jobDescription:string|null,
  resumeUrl:string|null,
  interviewQuestions:{
    questions:{
      interviews:InterviewQuestions[]
    }
  },
  _id:string
}

type InterviewQuestions={
  question:string,
  answer:string
}

const CONTAINER_ID = "akool-avatar-container";
const AVATAR_ID = "data_lira_sp-02";

function StartInterview() {
  const {interviewId}=useParams();
  const convex=useConvex();
  const [interviewData,setInterviewData]=useState<interviewData>();
  const videoContainerRef=useRef<any>(null);
  const [agoraSdk,setAgoraSdk]=useState<GenericAgoraSDK|null>();
  const [micOn,setMicOn]=useState(false);
  const [kbId,setKb]=useState<string|null>();
  const [joined,setJoined]=useState(false);

  useEffect(()=>{
    GetInterviewQuestions();
    
  },[interviewId])


  const GetInterviewQuestions=async()=>{
    const result=await convex.query(api.Interview.GetInterviewQuestions,{
      //@ts-ignore
      interviewRecordId:interviewId
    });
    console.log(result);
    setInterviewData(result);
    
  }
  useEffect(()=>{
    interviewData && GetKnowledgeBase();
  },[interviewData])




  const GetKnowledgeBase=async()=>{

    if(!agoraSdk) return;

    const result=await axios.post('/api/akool-knowledge-base',{
      questions:interviewData?.interviewQuestions
    });
    console.log(result);
    setKb(result.data.data._id);
  }

   useEffect(()=>{
    const sdk = new GenericAgoraSDK({ mode: "rtc", codec: "vp8" });
    // Register event handlers
sdk.on({
  onStreamMessage: (uid, message) => {
    console.log("Received message from", uid, ":", message);
  },
  onException: (error) => {
    console.error("An exception occurred:", error);
  },
  onMessageReceived: (message) => {
    console.log("New message:", message);
  },
  onMessageUpdated: (message) => {
    console.log("Message updated:", message);
  },
  onNetworkStatsUpdated: (stats) => {
    console.log("Network stats:", stats);
  },
  onTokenWillExpire: () => {
    console.log("Token will expire in 30s");
  },
  onTokenDidExpire: () => {
    console.log("Token expired");
  },
  onUserPublished: async (user, mediaType) => {
    if (mediaType === 'video') {
      await sdk.getClient().subscribe(user, mediaType);
      user.videoTrack?.play(videoContainerRef.current);
    } else if (mediaType === 'audio') {
      await sdk.getClient().subscribe(user, mediaType);
      user.audioTrack?.play();
    }
  }
});
setAgoraSdk(sdk);

return()=>{
  sdk.leaveChat();
  sdk.leaveChannel();
  sdk.closeStreaming();
}
  },[])
    const StartConversation=async ()=>{
    const result=await axios.post('/api/akool-session',{
      avatar_id:AVATAR_ID,
      knowledge_id:kbId
      });
    console.log(result);
    const credentials=result.data.data.credentials;
    //Connect to Agora channel and start chat
    if(!credentials){
      throw new Error("No credentials received from server");
      return;
    }await agoraSdk?.joinChannel({
       agora_app_id: credentials.agora_app_id,
  agora_channel: credentials.agora_channel,
  agora_token: credentials.agora_token,
  agora_uid: credentials.agora_uid
  });
  await agoraSdk?.joinChat({
  vid: "en-US-Wavenet-A",
  lang: "en",
  mode: 2 //1  1 for repeat mode, 2 for dialog mode
});
await agoraSdk?.toggleMic();
setMicOn(true);
setJoined(true);
    }

    const LeaveConversation=async()=>{
      if(!agoraSdk) return;
      await agoraSdk.leaveChat();
      await agoraSdk.leaveChannel();
      await agoraSdk.closeStreaming();
      setJoined(false);
      setMicOn(false);
    }

    const toggleMic=async()=>{
      if(!agoraSdk) return;
      await agoraSdk?.toggleMic();
      setMicOn(agoraSdk?.isMicEnabled());
    }


 

  return (
    <div>
      <div ref={videoContainerRef}
      id={CONTAINER_ID }
      style={{
        width:640,
        height:480,
        background:'#000000',
        marginTop:20
      }}>

      </div>
      <div>
        <Button onClick={toggleMic}>{micOn ? "Mute Mic" : "Unmute Mic"}</Button>
        
        {!joined? <Button onClick={StartConversation}>Start Conversation </Button>
        : <Button onClick={LeaveConversation}>Leave Conversation</Button>}
      </div>
    </div>
  )
}

export default StartInterview