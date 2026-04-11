import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const LIVEAVATAR_BASE_URL = "https://api.liveavatar.com";
// Default avatar ID; replace with your actual LiveAvatar avatar_id if needed.
const DEFAULT_AVATAR_ID = "64b526e4-741c-43b6-a918-4e40f3261c7a";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { avatarId, voiceId, contextId, systemPrompt } = body as {
      avatarId?: string;
      voiceId?: string;
      contextId?: string;
      systemPrompt?: string;
      isSandbox?: boolean;
    };

    if (!process.env.HEYGEN_API_KEY) {
      console.error("HEYGEN_API_KEY is not configured");
      return NextResponse.json(
        { error: "HEYGEN_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const resolvedAvatarId = avatarId || DEFAULT_AVATAR_ID;

    if (!resolvedAvatarId) {
      console.error("No avatar_id provided and no default configured");
      return NextResponse.json(
        { error: "avatar_id is required but was not provided" },
        { status: 400 }
      );
    }

    const requestedSandbox =
      typeof body?.isSandbox === "boolean"
        ? body.isSandbox
        : process.env.NODE_ENV !== "production";

    const tokenPayload = (isSandbox: boolean) => {
      const payload: Record<string, any> = {
        mode: "FULL",
        avatar_id: resolvedAvatarId,
        is_sandbox: isSandbox,
        interactivity_type: "CONVERSATIONAL",
        avatar_persona: {
          voice_id: voiceId || null,
          context_id: contextId || null,
          language: "en",
        },
      };
      
      // Add system prompt to custom knowledge base if provided
      if (systemPrompt) {
        payload.custom_knowledge_base = {
          source: "text",
          content: systemPrompt,
        };
      }
      
      return payload;
    };

    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.HEYGEN_API_KEY,
      accept: "application/json",
    };

    // Step 1: Create a LiveAvatar session token (retry non-sandbox if avatar doesn't support sandbox)
    let tokenRes;
    try {
      tokenRes = await axios.post(
        `${LIVEAVATAR_BASE_URL}/v1/sessions/token`,
        tokenPayload(requestedSandbox),
        { headers }
      );
    } catch (err: any) {
      const data = err?.response?.data;
      const msg = data?.message || "";
      const firstDetailMsg = data?.data?.[0]?.message || "";
      const sandboxUnsupported =
        `${msg} ${firstDetailMsg}`.toLowerCase().includes("not supported in sandbox");

      if (requestedSandbox && sandboxUnsupported) {
        tokenRes = await axios.post(
          `${LIVEAVATAR_BASE_URL}/v1/sessions/token`,
          tokenPayload(false),
          { headers }
        );
      } else {
        throw err;
      }
    }

    const sessionToken = tokenRes.data?.data?.session_token;

    if (!sessionToken) {
      console.error(
        "Invalid response from LiveAvatar /v1/sessions/token:",
        tokenRes.data
      );
      throw new Error("Failed to create LiveAvatar session token");
    }

    // Step 2: Start the session to get LiveKit details
    const startRes = await axios.post(
      `${LIVEAVATAR_BASE_URL}/v1/sessions/start`,
      {},
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    const startData = startRes.data?.data;

    if (!startData || !startData.livekit_url || !startData.livekit_client_token) {
      console.error(
        "Invalid response from LiveAvatar /v1/sessions/start:",
        startRes.data
      );
      throw new Error("Failed to start LiveAvatar session");
    }

    return NextResponse.json({
      success: true,
      livekit_url: startData.livekit_url,
      livekit_token: startData.livekit_client_token,
      session_id: startData.session_id,
    });
  } catch (error: any) {
    // Bubble up common LiveAvatar error codes more clearly to the client
    const code = error?.response?.data?.code;
    if (code === 4033) {
      return NextResponse.json(
        {
          error: "Insufficient LiveAvatar credits for session",
          details: error?.response?.data,
        },
        { status: 402 }
      );
    }
    console.error(
      "Error creating LiveAvatar session:",
      error?.response?.data || error.message || error
    );
    return NextResponse.json(
      {
        error: "Failed to create LiveAvatar session",
        details: error?.response?.data || error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
