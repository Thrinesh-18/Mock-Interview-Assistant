import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

type Props = {
  feedbackInfo: FeedbackInfo | string | any
}

export type FeedbackInfo = {
  feeback?: string,
  feedback?: string,
  rating?: number,
  suggestion?: string,
  suggestions?: string
}

function FeedbackDialog({feedbackInfo}:Props) {
  // Handle string feedback or object feedback
  // Support both capitalized (from Convex DB) and lowercase field names
  const feedback = typeof feedbackInfo === 'string' 
    ? feedbackInfo 
    : feedbackInfo?.feeback || feedbackInfo?.feedback || feedbackInfo?.Feedback || '';
  
  const rating = typeof feedbackInfo === 'object' && (feedbackInfo?.rating !== undefined || feedbackInfo?.Rating !== undefined)
    ? (feedbackInfo?.rating ?? feedbackInfo?.Rating)
    : 'N/A';
  
  const suggestion = typeof feedbackInfo === 'object' 
    ? (feedbackInfo?.suggestion || feedbackInfo?.suggestions || feedbackInfo?.Suggestions || 'No suggestions available') 
    : 'No suggestions available';

  console.log('FeedbackDialog received:', {feedbackInfo, feedback, rating, suggestion});

  return (
    <Dialog>
      <DialogTrigger asChild><Button>Feedback</Button></DialogTrigger>
      <DialogContent className='max-h-[600px] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl '>Interview Feedback</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div>
            <h3 className='font-bold text-lg mb-2 text-[oklch(60.016%_0.12933_236.877)]'>Feedback</h3>
            <p className='text-gray-700 leading-relaxed'>
              {feedback || 'No feedback available'}
            </p>
          </div>

          <div>
            <h3 className='font-bold text-lg mb-2 text-[oklch(60.016%_0.12933_236.877)]'>Suggestions for Improvement</h3>
            <p className='text-gray-700 leading-relaxed'>
              {suggestion}
            </p>
          </div>
          
          <div>
            <h3 className='font-bold text-lg mb-2 text-[oklch(60.016%_0.12933_236.877)]'>Rating</h3>
            <div className='flex items-center gap-2'>
              <span className='text-2xl font-bold '>
                {rating}
              </span>
              {typeof rating === 'number' && <span className='text-gray-600'>/10</span>}
            </div>
          </div>
          
          
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackDialog