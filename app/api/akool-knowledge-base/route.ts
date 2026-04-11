import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { questions } = await req.json();
    
    // Create a detailed system prompt that instructs the avatar to ask interview questions
    const questionsList = questions?.questions?.interviews || [];
    const questionsFormatted = questionsList.map((q: any, i: number) => `${i + 1}. ${q.question}`).join('\n');
    
    const systemPrompt = `You are a professional technical interviewer. Your job is to conduct a structured interview.

INTERVIEW QUESTIONS TO ASK (in order, one after another):
${questionsFormatted}

HOW TO CONDUCT THE INTERVIEW:
1. Listen to what the candidate says
2. After they answer each question, ask the next question from the list
3. You can ask follow-up questions to understand their answer better
4. Be conversational and professional
5. Do not move to the next question until they finish answering
6. Do not repeat or echo their words back to them
7. After asking all questions, summarize the interview

Remember: Your goal is to ask these specific questions in order and evaluate their responses. Start asking Question 1 now.`;

    return NextResponse.json({
      success: true,
      systemPrompt: systemPrompt,
      questions: questions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error preparing interview context:", error);
    return NextResponse.json(
      { error: "Failed to prepare interview context" },
      { status: 500 }
    );
  }
}