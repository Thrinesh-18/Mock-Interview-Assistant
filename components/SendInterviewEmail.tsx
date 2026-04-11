"use client"

import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "./ui/button"
import { Send } from "lucide-react";

interface Props {
  interviewId: Id<"InterviewSessionTable">
  senderName: string
  senderEmail: string
  className?: string
}

export default function SendInterviewEmail({
  interviewId,
  senderName,
  senderEmail,
  className,
}: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")

  const handleSend = async () => {
    if (!email) return
    setStatus("loading")

    const res = await fetch("/api/send-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail: email,
        interviewId: interviewId.toString(),
        senderName,
        senderEmail,
        
      }),
    })

    setStatus(res.ok ? "sent" : "error")
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <input
          type="email"
          placeholder="Enter candidate email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "sent"}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!email || status === "loading" || status === "sent"}
          className="px-4 py-2 text-sm rounded bg-[oklch(60.016%_0.12933_236.877)] text-white"
        >
          
          {status === "loading"
            ? "Sending..."
            : status === "sent"
            ? "Sent!"
            : <Send size={20} />}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs">Failed to send. Try again.</p>
      )}
      {status === "sent" && (
        <p className="text-green-500 text-xs">Interview link sent successfully!</p>
      )}
    </div>
  )
}