import { NextRequest, NextResponse } from "next/server"
import { transporter } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  const { recipientEmail, interviewId, senderName, senderEmail } =
    await req.json()

  if (!recipientEmail || !interviewId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const interviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/interview/${interviewId}`

  try {
    await transporter.sendMail({
      from: `"Mock Interview App" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `${senderName} has shared a mock interview with you`,
      html: `
        <div style="font-family:sans-serif; max-width:480px">
          <h2>You've been invited to a mock interview</h2>
          <p>
            <strong>${senderName}</strong>
            <span style="color:#888">(${senderEmail})</span>
            has shared a mock interview session with you.
          </p>
          <a href="${interviewLink}"
             style="display:inline-block; padding:12px 24px;
                    background:#534AB7; color:#fff;
                    border-radius:8px; text-decoration:none; margin:16px 0">
            Start Interview
          </a>
          <p style="color:#888; font-size:12px">
            Or copy this link:<br/>
            <a href="${interviewLink}" style="color:#534AB7">${interviewLink}</a>
          </p>
          <hr style="border:none; border-top:1px solid #eee; margin:24px 0"/>
          <p style="color:#aaa; font-size:11px">
            Sent via Mock Interview App on behalf of ${senderName}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Email error:", err)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}