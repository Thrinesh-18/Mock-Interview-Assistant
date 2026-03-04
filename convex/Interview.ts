
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const SaveInterviewQuestions=mutation({
  args:{
    questions:v.any(),
    uid:v.id("UserTable"),
    resumeUrl:v.union(v.string(), v.null()),
    jobTitle:v.optional(v.string()),
    jobDescription:v.optional(v.string())
  },
  handler:async(ctx,args)=>{
    const result=await ctx.db.insert("InterviewSessionTable",{
      interviewQuestions:args.questions,
      userId:args.uid,
      resumeUrl:args.resumeUrl,
      status:"draft",
      jobTitle:args.jobTitle,
      jobDescription:args.jobDescription
    })
    return result;
  }
})