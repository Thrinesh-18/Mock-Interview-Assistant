import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, conversationHistory, userMessage } = await req.json();

    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: "systemPrompt and userMessage are required" },
        { status: 400 }
      );
    }

    // Use OpenAI to generate the avatar's response
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...(conversationHistory || []),
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const avatarResponse =
      openaiResponse.data?.choices?.[0]?.message?.content || "";

    if (!avatarResponse) {
      throw new Error("Failed to generate response from OpenAI");
    }

    return NextResponse.json({
      success: true,
      response: avatarResponse,
    });
  } catch (error: any) {
    console.error("Error generating avatar response:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to generate avatar response",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
