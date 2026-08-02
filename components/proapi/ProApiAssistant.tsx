"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { allEndpoints } from "@/lib/proapi/mock-data";
import { generateCodeSample } from "@/lib/proapi/code-samples";

const chips = [
  "How do I authenticate?",
  "Show sample request",
  "Explain POST /v1/feedback",
  "What is error invalid_payload?",
];

function answerQuery(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("auth")) {
    return "Use Bearer token auth: set Authorization: Bearer YOUR_API_KEY on every request. OAuth 2.0 is available at POST /oauth/token. See /proapi/authentication for flows.";
  }
  if (q.includes("sample") || q.includes("request")) {
    const ep = allEndpoints.find((e) => e.method === "POST" && e.path.includes("feedback"));
    if (ep) return generateCodeSample(ep, "curl", "YOUR_TOKEN");
    return "Try POST /v1/feedback with page_path and message fields.";
  }
  if (q.includes("feedback") || q.includes("post")) {
    return "POST /v1/feedback submits documentation feedback from the ProFeed widget. Required: page_path, message. Optional: stars, helpful, anchor. Returns 201 with feedback id.";
  }
  if (q.includes("error") || q.includes("invalid_payload")) {
    return "invalid_payload (400): Missing required fields in request body. Ensure page_path and message are present and Content-Type is application/json.";
  }
  return "I can help with authentication, endpoint explanations, code samples, and error codes. Try one of the suggested questions above.";
}

export function ProApiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi — I'm the ProAPI assistant. Ask about auth, endpoints, or errors." },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    const reply = answerQuery(text);
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: reply },
    ]);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30 transition hover:bg-[#A855F7]"
        aria-label="API assistant"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-20 right-6 z-50 flex h-[420px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[rgba(124,58,237,0.15)] bg-white/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-semibold text-[#7C3AED]">ProAPI Assistant</p>
              <p className="text-[10px] text-slate-500">API questions · code · errors</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`rounded-lg px-3 py-2 text-xs ${
                    m.role === "user"
                      ? "ml-6 bg-[#7C3AED]/10 text-slate-800"
                      : "mr-6 bg-slate-100 text-slate-700"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 border-t border-slate-100 px-3 py-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => send(c)}
                  className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:border-[#7C3AED]/30 hover:text-[#7C3AED]"
                >
                  {c}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-slate-200 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about an endpoint…"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#7C3AED] px-3 py-2 text-white"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
