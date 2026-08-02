import { INITIAL_CHIPS } from "@/lib/assistant/commands";
import { streamLlmReply } from "@/lib/assistant/llm";
import { resolveNavigationIntent } from "@/lib/assistant/resolve-intent";
import type { ChatTurn } from "@/lib/assistant/types";

const MAX_MESSAGE_LEN = 1200;
const MAX_TURNS = 24;

type Body = {
  messages?: { role?: string; content?: string }[];
  stream?: boolean;
};

function parseMessages(body: Body): ChatTurn[] | null {
  if (!Array.isArray(body.messages)) return null;
  const turns: ChatTurn[] = [];
  for (const m of body.messages.slice(-MAX_TURNS)) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!content || content.length > MAX_MESSAGE_LEN) continue;
    turns.push({ role: m.role, content });
  }
  const lastUser = [...turns].reverse().find((t) => t.role === "user");
  if (!lastUser) return null;
  return turns;
}

function errorPayload(
  reply: string,
  command: ReturnType<typeof resolveNavigationIntent>,
  llmError?: string,
) {
  return {
    reply,
    command: command ?? null,
    chips: INITIAL_CHIPS.slice(0, 4),
    llmUsed: false,
    llmError,
  };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages?.length) {
    return Response.json({ error: "No valid messages" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((t) => t.role === "user")!;
  const navIntent = resolveNavigationIntent(lastUser.content);
  const wantsStream = body.stream !== false;

  if (!process.env.GEMINI_API_KEY?.trim()) {
    const payload = errorPayload(
      "ProAssist needs a Gemini API key. Add GEMINI_API_KEY to .env.local and restart the dev server.",
      navIntent,
      "missing_api_key",
    );
    return Response.json(payload);
  }

  if (!wantsStream) {
    const { generateLlmReply } = await import("@/lib/assistant/llm");
    const llm = await generateLlmReply(messages);
    if (!llm.ok) {
      console.error("[assistant/chat] Gemini failed:", llm.error);
      return Response.json(
        errorPayload(
          "Sorry, I couldn't reach the AI service right now. Please try again.",
          navIntent,
          llm.error,
        ),
      );
    }
    return Response.json({
      reply: llm.reply,
      command: navIntent ?? null,
      chips: INITIAL_CHIPS.slice(0, 4),
      llmUsed: true,
      sources: llm.sources,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        for await (const chunk of streamLlmReply(messages)) {
          if (chunk.type === "text") {
            send({ type: "text", text: chunk.text });
          } else if (chunk.type === "done") {
            send({
              type: "done",
              command: navIntent ?? null,
              chips: INITIAL_CHIPS.slice(0, 4),
              sources: chunk.sources,
            });
          } else if (chunk.type === "error") {
            console.error("[assistant/chat] Gemini stream failed:", chunk.error);
            send({
              type: "error",
              reply:
                chunk.error === "GEMINI_API_KEY is not configured on the server."
                  ? "ProAssist needs a Gemini API key. Add GEMINI_API_KEY to .env.local and restart the dev server."
                  : "Sorry, I couldn't reach the AI service right now. Please try again.",
              command: navIntent ?? null,
              chips: INITIAL_CHIPS.slice(0, 4),
            });
          }
        }
      } catch (e) {
        console.error("[assistant/chat] Stream error:", e);
        send({
          type: "error",
          reply: "Sorry, I couldn't reach the AI service right now. Please try again.",
          command: navIntent ?? null,
          chips: INITIAL_CHIPS.slice(0, 4),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
