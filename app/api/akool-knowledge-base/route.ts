import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req:NextRequest) {
  const {questions}=await req.json();
//   const result=await axios.get("https://openapi.akool.com/api/open/v4/knowledge/list",{
//   headers:{
//     Authorization:`Bearer ${process.env.AKOOL_API_TOKEN}`
//   }
//   });

// const isExist=result.data.data.find((item:any)=>item.name=='Interview Agent Prod')

// if(!isExist){
//   //Create new KB
  const resp=await axios.post('https://openapi.akool.com/api/open/v4/knowledge/create',{
    name:'Interview Agent Prod'+Date.now(),
    prologue:'Tell me about yourself',
    prompt:`You are an interview assistant. Your task is to help users prepare for their interviews by providing them with relevant questions and feedback based on their resume and job description. Start with:"tell me about yourself".You will analyze the user\'s resume and the job description to ask interview questions that can help the user practice effectively. Additionally, you will provide constructive feedback on the user\'s answers to help them improve their performance in real interviews. 
    questions:
    ${JSON.stringify(questions)}`
  },{
    headers:{
      Authorization:`Bearer ${process.env.AKOOL_API_TOKEN}`
    }
  },);
  console.log(resp.data);
  return NextResponse.json(resp.data);
}