import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Inter } from "next/font/google";
import { resume } from "react-dom/server";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string()
}),
  InterviewSessionTable: defineTable({
    interviewQuestions: v.any(),
    resumeUrl: v.union(v.string(), v.null()),
    userId: v.id("UserTable"),
    status:v.string(),
    jobTitle:v.optional(v.string()),
    jobDescription:v.optional(v.string())
  })
})