import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {messages} = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const result = await axios.post('http://localhost:5678/webhook/9ad354a3-3003-4561-a198-93d8fcc3e580', {
      messages:JSON.stringify(messages)
    });
    
    console.log('Feedback API response:', result.data);
    
    // Ensure we always return valid feedback content
    if (!result.data) {
      return NextResponse.json(
        { error: "No feedback generated" },
        { status: 500 }
      );
    }
    
    // Parse webhook response and structure it as FeedbackInfo
    const feedbackData = parseFeedbackResponse(result.data);
    console.log('Parsed feedback data:', feedbackData);
    
    return NextResponse.json(feedbackData);
  } catch (error) {
    console.error('Interview feedback error:', error);
    
    // Return a meaningful error response instead of crashing
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: `External service error: ${error.message}` },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}

/**
 * Parse webhook response and structure it as FeedbackInfo
 * Expected output format:
 * {
 *   feeback: string,
 *   rating: number (0-10),
 *   suggestion: string
 * }
 */
function parseFeedbackResponse(webhookData: any) {
  console.log('parseFeedbackResponse input:', webhookData);
  
  // Handle capitalized field names from Convex database
  if (webhookData?.Feedback || webhookData?.feedback || webhookData?.feeback) {
    const feedback = webhookData?.Feedback || webhookData?.feedback || webhookData?.feeback;
    const rating = webhookData?.Rating !== undefined ? webhookData?.Rating : webhookData?.rating;
    const suggestion = webhookData?.Suggestions || webhookData?.suggestion || webhookData?.suggestions;
    
    return {
      feeback: String(feedback),
      rating: typeof rating === 'number' ? Math.min(Math.max(rating, 0), 10) : 7,
      suggestion: String(suggestion || "Keep practicing!")
    };
  }
  
  // If webhook returns an object with the expected structure, use it as-is
  if (webhookData?.feeback && webhookData?.rating !== undefined && webhookData?.suggestion) {
    return webhookData;
  }
  
  // If webhook returns a string, try to parse it
  if (typeof webhookData === 'string') {
    // Try to extract rating from common patterns like "Rating: 7/10" or "7/10"
    const ratingMatch = webhookData.match(/(?:rating[:\s]+)?(\d+)\s*(?:\/10)?/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 7;
    
    return {
      feeback: webhookData,
      rating: Math.min(Math.max(rating, 0), 10), // Clamp between 0-10
      suggestion: "Continue practising and improving your communication skills."
    };
  }
  
  // If it's an object but not in the expected format, try to extract common fields
  const feedback = webhookData?.feedback || webhookData?.message || JSON.stringify(webhookData);
  const rating = webhookData?.rating || webhookData?.score || 7;
  const suggestion = webhookData?.suggestion || webhookData?.suggestions || webhookData?.recommendation || "Keep practicing!";
  
  return {
    feeback: String(feedback),
    rating: Math.min(Math.max(Number(rating), 0), 10),
    suggestion: String(suggestion)
  };
}