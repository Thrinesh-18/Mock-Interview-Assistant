import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { questions, currentQuestionIndex, userMessage } = await req.json();

    if (!questions || currentQuestionIndex === undefined) {
      return NextResponse.json(
        { error: "questions and currentQuestionIndex are required" },
        { status: 400 }
      );
    }

    const questionsList = questions?.questions?.interviews || [];
    
    // Determine next question index
    let nextIndex = currentQuestionIndex + 1;
    let nextQuestion = "";
    let isFinished = false;

    if (nextIndex < questionsList.length) {
      // Ask the next question from the list
      nextQuestion = questionsList[nextIndex].question;
    } else {
      // All questions have been asked
      nextQuestion = "Thank you for your responses. That completes our interview. You did great!";
      isFinished = true;
    }

    return NextResponse.json({
      success: true,
      response: nextQuestion,
      nextQuestionIndex: isFinished ? currentQuestionIndex : nextIndex,
      isFinished: isFinished,
    });
  } catch (error: any) {
    console.error("Error generating next question:", error?.message);
    return NextResponse.json(
      {
        error: "Failed to generate next question",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
