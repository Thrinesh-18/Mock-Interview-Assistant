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

    console.log('Sending messages to webhook for feedback generation...');
    const result = await axios.post('https://n8n-production-0e15.up.railway.app/webhook/9ad354a3-3003-4561-a198-93d8fcc3e580', {
      messages:JSON.stringify(messages)
    });
    
    console.log('Webhook response received:', {
      status: result.status,
      data: result.data,
      type: typeof result.data
    });
    
    // Ensure we always return valid feedback content
    if (!result.data) {
      console.error('Webhook returned empty response');
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
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
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
  console.log('parseFeedbackResponse input type:', typeof webhookData);
  
  // Handle string input (convert to object for processing)
  if (typeof webhookData === 'string') {
    try {
      // Try to parse as JSON first
      webhookData = JSON.parse(webhookData);
    } catch {
      // If not JSON, treat as plain text feedback
      const ratingMatch = webhookData.match(/(?:rating[:\s]+)?(\d+)\s*(?:\/10)?/i);
      const rating = ratingMatch ? parseInt(ratingMatch[1]) : 7;
      
      return {
        feeback: webhookData,
        rating: Math.min(Math.max(rating, 0), 10),
        suggestion: "Continue practising and improving your communication skills."
      };
    }
  }
  
  // Extract feedback from various possible field names
  const feedback = webhookData?.Feedback || webhookData?.feedback || webhookData?.feeback || 
                   webhookData?.message || webhookData?.feedbackText || '';
  
  // Extract rating from various possible field names
  let rating = webhookData?.Rating || webhookData?.rating || webhookData?.score || 7;
  
  // Extract suggestion from various possible field names
  const suggestion = webhookData?.Suggestions || webhookData?.Suggestion || webhookData?.suggestion || 
                     webhookData?.suggestions || webhookData?.recommendations || 
                     webhookData?.recommendation || webhookData?.improvementAreas || 
                     "Keep practicing and improving your communication skills!";
  
  // Validate and clamp rating
  if (typeof rating !== 'number') {
    const ratingStr = String(rating);
    const ratingMatch = ratingStr.match(/(\d+)/);
    rating = ratingMatch ? parseInt(ratingMatch[1]) : 7;
  }
  rating = Math.min(Math.max(rating, 0), 10);
  
  const result = {
    feeback: String(feedback || 'No feedback available'),
    rating: rating,
    suggestion: String(suggestion)
  };
  
  console.log('parseFeedbackResponse output:', result);
  return result;
}