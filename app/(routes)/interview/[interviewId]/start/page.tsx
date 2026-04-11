"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, isAudioTrack, isVideoTrack } from "livekit-client";
import { Mic, MicOff, PhoneCall, User } from "lucide-react";
import { toast } from "sonner";
import { FeedbackInfo } from "@/app/(routes)/dashboard/_components/FeedbackDialog";

export type InterviewData = {
  jobTitle: string | null,
  jobDescription: string | null,
  resumeUrl: string | null,
  interviewQuestions: {
    questions: {
      interviews: InterviewQuestion[]
    }
  },
  _id: string,
  userId:string | null,
  status:string | null,
  feedback:FeedbackInfo | null
};

type InterviewQuestion = {
  question: string;
  answer: string;
};

type Message = {
  id: string;
  from: "user" | "assistant";
  content: string;
};

// Set this to the LiveAvatar avatar_id from your dashboard / Postman
const AVATAR_ID = "64b526e4-741c-43b6-a918-4e40f3261c7a";
// LiveAvatar voice_id must be a UUID. If you leave this null, some avatars may produce no audio.
const VOICE_ID: string | null = "c2527536-6d1f-4412-a643-53a3497dada9";

function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();

  const [interviewData, setInterviewData] = useState<InterviewData>();
  const [systemPrompt, setSystemPrompt] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const responding = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  const room = useRef<Room | null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const audioEl = useRef<HTMLAudioElement>(null);
  const lastAudioTrackSid = useRef<string | null>(null);
  const attachedAudioTrack = useRef<{ detach?: (el?: HTMLMediaElement | null) => void } | null>(null);
  const attachedAudioPriority = useRef<number>(-1);
  const currentQuestionIndexRef = useRef<number>(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const updateFeedback=useMutation(api.Interview.UpdateFeedback);
  const router=useRouter();

  useEffect(() => {
    if (interviewId) void getInterviewQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const getInterviewQuestions = async () => {
    const result = await convex.query(api.Interview.GetInterviewQuestions, {
      interviewRecordId: interviewId as Id<"InterviewSessionTable">,
    });
    setInterviewData(result as InterviewData);
  };

  useEffect(() => {
    if (interviewData) void prepareSystemPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewData]);

  const prepareSystemPrompt = async () => {
    const result = await axios.post("/api/akool-knowledge-base", {
      questions: interviewData?.interviewQuestions,
    });
    setSystemPrompt(result.data.systemPrompt);
  };

  const publishAgentControl = async (event: Record<string, unknown>) => {
    const activeRoom = room.current;
    const sid = sessionIdRef.current;
    if (!activeRoom || !sid) return false;

    const payload = new TextEncoder().encode(
      JSON.stringify({
        session_id: sid,
        ...event,
      })
    );
    try {
      await activeRoom.localParticipant.publishData(payload, {
        reliable: true,
        topic: "agent-control",
      });
      return true;
    } catch (err) {
      console.error("Failed to publish agent-control event:", err);
      return false;
    }
  };

  const speakText = async (text: string) => {
    await publishAgentControl({ event_type: "avatar.speak_text", text });
  };

  const startListening = async () => {
    await publishAgentControl({ event_type: "avatar.start_listening" });
  };

  const generateAndSpeakResponse = async (userMessage: string) => {
    if (!interviewData) return;

    try {
      // Get the next question from the interview list
      const response = await axios.post("/api/get-next-question", {
        questions: interviewData.interviewQuestions,
        currentQuestionIndex: currentQuestionIndexRef.current,
        userMessage: userMessage,
      });

      const nextQuestion = response.data?.response;
      const nextIndex = response.data?.nextQuestionIndex;
      const isFinished = response.data?.isFinished;

      if (nextQuestion) {
        // Update the question index
        currentQuestionIndexRef.current = nextIndex;

        // Have the avatar speak the next question
        // The avatar's transcription will be captured by the avatar.transcription event handler
        await speakText(nextQuestion);

        // After the avatar finishes speaking, put it back in listening mode if not finished
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        if (!isFinished) {
          await startListening();
        }
      }
    } catch (error) {
      console.error("Error getting next question:", error);
      // Fallback response if something goes wrong
      await speakText("I didn't quite catch that. Could you please repeat?");
      await startListening();
    }
  };

  const sanitizeForSpeech = (text: string) => {
    // Avoid sending profanity back to the avatar if STT mishears.
    return text.replace(/\b(fuck|motherfucker|shit|bitch|asshole)\b/gi, "[redacted]");
  };

  // Removed buildAutoReply - let the avatar handle responses based on system prompt

  const startConversation = async () => {
    if (!systemPrompt) return;
    if (joined || loading) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/liveavatar-session", {
        avatarId: AVATAR_ID,
        voiceId: VOICE_ID,
        systemPrompt: systemPrompt,
      });

      const { success, livekit_url, livekit_token, session_id } = response.data || {};
      if (!success || !livekit_url || !livekit_token || !session_id) {
        throw new Error("Failed to get LiveAvatar LiveKit details");
      }
      sessionIdRef.current = session_id;

      const newRoom = new Room();
      room.current = newRoom;

      newRoom.on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {
        try {
          const txt = new TextDecoder().decode(payload);
          if (topic === "agent-response") {
            const evt = JSON.parse(txt) as { event_type?: string; text?: string };
            if (evt.event_type === "user.transcription" && typeof evt.text === "string") {
              const userText = evt.text;
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  from: "user",
                  content: userText,
                },
              ]);

              // Generate avatar response based on the interview context
              if (!responding.current) {
                responding.current = true;
                generateAndSpeakResponse(userText).finally(() => {
                  responding.current = false;
                });
              }
            }
            if (evt.event_type === "avatar.transcription" && typeof evt.text === "string") {
              const assistantText = evt.text;
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  from: "assistant",
                  content: assistantText,
                },
              ]);
            }
          }
        } catch {
          // ignore
        }
      });



      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (isVideoTrack(track) && videoEl.current) {
          track.attach(videoEl.current);
        }
        if (isAudioTrack(track) && audioEl.current) {
          const identity = participant?.identity ?? "unknown";
          // Prefer audio from "heygen" participant; fallback to "agent-*".
          const priority =
            identity === "heygen" ? 2 : identity.startsWith("agent-") ? 1 : 0;
          if (priority < attachedAudioPriority.current) return;

          lastAudioTrackSid.current = track.sid ?? null;
          attachedAudioPriority.current = priority;

          // Detach previous attached avatar audio track (if any) to avoid overlapping/overwriting.
          try {
            attachedAudioTrack.current?.detach?.(audioEl.current);
            if (videoEl.current) {
              attachedAudioTrack.current?.detach?.(videoEl.current);
            }
          } catch {
            // ignore
          }

          // Attach to both <audio> and <video> to maximize playback compatibility.
          track.attach(audioEl.current);
          if (videoEl.current) track.attach(videoEl.current);
          attachedAudioTrack.current = track as any;

          audioEl.current.muted = false;
          audioEl.current.volume = 1;
          void audioEl.current.play().catch((err) => {
            console.error("Audio autoplay blocked:", err);
          });

          if (videoEl.current) {
            videoEl.current.muted = false;
            videoEl.current.volume = 1;
            void videoEl.current.play().catch(() => {
              // ignore: video is already autoplaying, but some browsers gate audio to user gestures
            });
          }

        }
      });

      await newRoom.connect(livekit_url, livekit_token);

      try {
        await newRoom.localParticipant.setMicrophoneEnabled(true);
        setMicOn(true);
      } catch (err) {
        console.error("Failed to enable microphone:", err);
        setMicOn(false);
      }
      setJoined(true);

      // Wait for avatar to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start the interview
      await speakText("Hi! I'm your interview assistant. Let's begin the interview. Tell me about yourself.");
      
      // Put avatar in listening mode
      await new Promise(resolve => setTimeout(resolve, 500));
      await startListening();
    } catch (e) {
      console.error("Error starting conversation:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = async () => {
    const activeRoom = room.current;
    if (!activeRoom) return;

    const next = !micOn;
    try {
      await activeRoom.localParticipant.setMicrophoneEnabled(next);
      setMicOn(next);
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
    }
  };

  const leaveConversation = async () => {
    if (room.current) {
      await room.current.disconnect();
      room.current = null;
    }
    if (videoEl.current) videoEl.current.srcObject = null;
    if (audioEl.current) audioEl.current.srcObject = null;
    attachedAudioPriority.current = -1;
    setJoined(false);
    setMicOn(false);
    setMessages([]);

    await GenerateFeedback();
  };


  const GenerateFeedback=async()=>{
    toast.warning('Generating feedback, Please Wait...');
    try {
      const result=await axios.post("/api/interview-feedback",{
        messages:messages
      });
      
      // Validate that feedback was actually generated
      if (!result.data || (result.data.error && !result.data.feedback)) {
        toast.error('Failed to generate feedback. Please try again.');
        console.error('Feedback generation failed:', result.data);
        return;
      }
      
      console.log(result.data);
      toast.success('Feedback Generated Successfully');
      
      //Save the feedback 
      const resp=await updateFeedback({
        feedback:result.data,
        //@ts-ignore
        recordId:interviewId
      });
      console.log("Feedback saved to database:", resp);
      toast.success('Interview Completed!');

      //Navigate the feedback
      router.replace(`/dashboard`);
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Failed to generate feedback. Your interview was still saved.');
      
      // Still save the interview even if feedback fails
      try {
        await updateFeedback({
          feedback: "Feedback generation failed. Please try generating feedback later.",
          //@ts-ignore
          recordId:interviewId
        });
        router.replace(`/dashboard`);
      } catch (saveError) {
        console.error('Failed to save interview:', saveError);
        toast.error('Failed to save interview. Please refresh and try again.');
      }
    }
  }
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen h-screen bg-blue-100">
      <div className="flex flex-col items-center p-6 lg:w-2/3">
      <h2 className="text-2xl font-bold mb-6">Interview Session</h2>
      <div
        className="video-container relative rounded-2xl overflow-hidden border bg-white flex items-center justify-center"
        style={{
          width: 1200,
          height: 1000,
          background: "#000000",
          marginTop: 20,
        }}
      >
        {!joined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={100} className="text-gray-500" />
          </div>
        )}
        <video
          ref={videoEl}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%" }}
        />
        <audio ref={audioEl} autoPlay />
      </div>
      
        <div className="mt-5">
          {!joined ? (
            <Button
              onClick={startConversation}
              disabled={loading}
              className="flex items-center px-5 py-3 bg-green-500 text-white hover:bg-green-400 rounded-full shadow-lg transition disabled:opacity-50"
            >
              <PhoneCall className="mr-2" size={20}/>
              {loading ? "Connecting..." : "Connect Call"}
            </Button>
          ) : (
            <>
            <Button
              onClick={toggleMic}
              className={
                micOn
                  ? "mt-5 flex items-center px-5 py-3 rounded-full shadow-lg transition bg-yellow-400 text-white hover:bg-yellow-300"
                  : "mt-5 flex items-center px-5 py-3 rounded-full shadow-lg transition bg-gray-300 text-gray-800 hover:bg-gray-200"
              }
            >
              {micOn ? (
                <>
                <Mic className="mr-2" size={20}/>
                Mute 
                </>
              ) : (
                <>
                <MicOff className="mr-2" size={20}/>
                Unmute
                </>
              )}
            </Button>
            <Button
              onClick={leaveConversation}
              className="flex items-center px-5 py-3 bg-red-500 text-white hover:bg-red-400 rounded-full shadow-lg transition mt-4"
            >
              <PhoneCall className="mr-2 rotate-180" size={20}/>
              Leave Call
            </Button>
            </>
              

              )}
        </div>

      </div>
      <div className="flex flex-col items-center p-6 lg:w-1/3 bg-gray-100 mt-6 lg:mt-0">
        <h2 className=" text-2xl font-bold mb-6">Conversation</h2>
        <div className="flex 1 overflow-y-auto border border-gray-200 rounded-xl p-4 space-y-3">
          {messages.length === 0 ?
          <div>
            <p>No messages yet</p>
          </div>
          :
          <div>
            {messages.map((message) => (
              <div className={`${message.from === "user" ? "bg-blue-200 text-blue-800 self-start" 
                : "bg-green-200 text-green-800 self-end"} rounded-xl p-3`} key={message.id}>{message.content}</div>
            ))}
          </div>
}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
