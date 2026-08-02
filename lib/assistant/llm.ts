import "server-only";

import {
  buildProDocSystemPrompt,
  retrieveRelevantContext,
} from "@/lib/assistant/context-retrieval";

import type { ChatTurn } from "./types";

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-2.0-flash",
  "gemini-2.5-flash",
].filter((m): m is string => Boolean(m));

export type LlmResult =
  | { ok: true; reply: string; sources: string[] }
  | { ok: false; error: string };

export type StreamChunk =
  | { type: "text"; text: string }
  | { type: "done"; sources: string[] }
  | { type: "error"; error: string };

type GeminiHistoryTurn = {
  role: "user" | "model";
  parts: [{ text: string }];
};

/** Gemini requires history to start with user and alternate roles. */
export function buildGeminiChatHistory(turns: ChatTurn[]): GeminiHistoryTurn[] {
  const merged: ChatTurn[] = [];

  for (const turn of turns) {
    const last = merged[merged.length - 1];
    if (last?.role === turn.role) {
      last.content = `${last.content}\n\n${turn.content}`;
      continue;
    }
    merged.push({ ...turn });
  }

  while (merged.length > 0 && merged[0].role === "assistant") {
    merged.shift();
  }

  const history: GeminiHistoryTurn[] = [];
  for (const turn of merged) {
    const role = turn.role === "assistant" ? "model" : "user";
    const prev = history[history.length - 1];
    if (prev?.role === role) {
      prev.parts[0].text = `${prev.parts[0].text}\n\n${turn.content}`;
      continue;
    }
    history.push({ role, parts: [{ text: turn.content }] });
  }

  return history;
}

function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY?.trim() || null;
}

function lastUserQuery(messages: ChatTurn[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

function buildPayload(messages: ChatTurn[]) {
  const query = lastUserQuery(messages);
  const { text, sectionLabels } = retrieveRelevantContext(query);
  const contents = buildGeminiChatHistory(messages);

  return {
    contents,
    sectionLabels,
    body: {
      systemInstruction: {
        parts: [{ text: buildProDocSystemPrompt(text, sectionLabels) }],
      },
      contents,
    },
  };
}

async function geminiFetch(
  model: string,
  apiKey: string,
  body: object,
  stream: boolean,
): Promise<Response> {
  const action = stream ? "streamGenerateContent" : "generateContent";
  const suffix = stream ? "&alt=sse" : "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}?key=${encodeURIComponent(apiKey)}${suffix}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function parseGeminiStreamLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return "";
  const json = trimmed.slice(5).trim();
  if (!json || json === "[DONE]") return "";
  try {
    const data = JSON.parse(json) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    return "";
  }
}

export async function generateLlmReply(messages: ChatTurn[]): Promise<LlmResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return { ok: false, error: "GEMINI_API_KEY is not configured on the server." };
  }
  if (messages.length === 0) {
    return { ok: false, error: "No messages provided." };
  }

  const { body, sectionLabels, contents } = buildPayload(messages);
  if (contents.length === 0) {
    return { ok: false, error: "No valid conversation turns." };
  }

  let lastError = "Gemini request failed.";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await geminiFetch(model, apiKey, body, false);
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        lastError = errBody || `Gemini API (${model}) returned ${res.status}.`;
        if (res.status === 404 || res.status === 429) continue;
        return { ok: false, error: lastError };
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) {
        lastError = `Empty response from Gemini (${model}).`;
        continue;
      }
      return { ok: true, reply: text, sources: sectionLabels };
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Gemini request failed.";
    }
  }

  return { ok: false, error: lastError };
}

/** Async generator for streaming Gemini replies (SSE on the API route). */
export async function* streamLlmReply(
  messages: ChatTurn[],
): AsyncGenerator<StreamChunk> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    yield { type: "error", error: "GEMINI_API_KEY is not configured on the server." };
    return;
  }
  if (messages.length === 0) {
    yield { type: "error", error: "No messages provided." };
    return;
  }

  const { body, sectionLabels, contents } = buildPayload(messages);
  if (contents.length === 0) {
    yield { type: "error", error: "No valid conversation turns." };
    return;
  }

  let lastError = "Gemini request failed.";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await geminiFetch(model, apiKey, body, true);
      if (!res.ok || !res.body) {
        const errBody = await res.text().catch(() => "");
        lastError = errBody || `Gemini API (${model}) returned ${res.status}.`;
        if (res.status === 404 || res.status === 429) continue;
        yield { type: "error", error: lastError };
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const text = parseGeminiStreamLine(line);
          if (text) yield { type: "text", text };
        }
      }

      if (buffer.trim()) {
        const text = parseGeminiStreamLine(buffer);
        if (text) yield { type: "text", text };
      }

      yield { type: "done", sources: sectionLabels };
      return;
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Gemini request failed.";
    }
  }

  yield { type: "error", error: lastError };
}

export { buildProDocSystemPrompt, retrieveRelevantContext };
