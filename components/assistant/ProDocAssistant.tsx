"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { ArrowUp, Maximize2, Minus, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  CHIP_GEMINI_MESSAGES,
  INITIAL_CHIPS,
  assistantMeta,
  getCommandActionLink,
  getCommandLabel,
} from "@/content/assistant";
import type { AssistantChip, AssistantCommandId, ChatMessage } from "@/lib/assistant/types";
import { cn } from "@/lib/cn";

const PANEL_SPRING = { type: "spring" as const, stiffness: 400, damping: 34 };
const MESSAGES_STORAGE_KEY = "prodoc-assistant-messages";

function nextId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function QuickActionChips({
  chips,
  disabled,
  activeChipId,
  onSelect,
}: {
  chips: AssistantChip[];
  disabled: boolean;
  activeChipId?: AssistantCommandId | null;
  onSelect: (id: AssistantCommandId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {chips.map((chip) => (
        <motion.button
          key={chip.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip.id)}
          className={cn(
            "rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-accent/45 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-45",
            activeChipId === chip.id &&
              disabled &&
              "border-accent/60 bg-accent/15 ring-2 ring-accent/30",
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}

function MessageBubble({
  message,
  onChipSelect,
  chipsDisabled,
  activeChipId,
}: {
  message: ChatMessage;
  onChipSelect: (id: AssistantCommandId) => void;
  chipsDisabled: boolean;
  activeChipId?: AssistantCommandId | null;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={
          isUser
            ? "max-w-[90%] rounded-2xl rounded-br-md bg-accent px-3 py-2 text-[0.8125rem] leading-snug text-accent-foreground"
            : "prose prose-sm dark:prose-invert max-w-[94%] rounded-2xl rounded-bl-md border border-border/60 bg-card/95 px-3 py-2 text-[0.8125rem] leading-snug text-foreground [&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-accent [&_a]:underline"
        }
      >
        {isUser ? (
          message.content
        ) : message.content ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : (
          <span className="inline-block h-4 w-1 animate-pulse rounded-sm bg-accent/60" aria-hidden />
        )}
      </div>
      {!isUser && message.actionLink ? (
        <Link
          href={message.actionLink.href}
          className="inline-flex items-center rounded-full border border-accent/45 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent shadow-sm transition-colors hover:bg-accent/15"
        >
          {message.actionLink.label}
        </Link>
      ) : null}
      {!isUser && message.chips?.length ? (
        <QuickActionChips
          chips={message.chips}
          disabled={chipsDisabled}
          activeChipId={activeChipId}
          onSelect={onChipSelect}
        />
      ) : null}
    </motion.div>
  );
}

function AssistantLauncher({
  onClick,
  showNotify,
  reducedMotion,
  expanded,
}: {
  onClick: () => void;
  showNotify: boolean;
  reducedMotion: boolean;
  expanded: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={expanded ? "Close assistant" : "Open ProAssist"}
      className="prodoc-assistant-launcher group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-card/55 shadow-lg outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-accent/50 sm:h-[3.75rem] sm:w-[3.75rem]"
      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
      animate={
        reducedMotion
          ? undefined
          : { y: [0, -4, 0], scale: [1, 1.015, 1] }
      }
      transition={
        reducedMotion
          ? undefined
          : {
              y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      <span className="prodoc-assistant-launcher__ring pointer-events-none absolute -inset-[3px] rounded-full" aria-hidden />
      <span className="prodoc-assistant-launcher__glow pointer-events-none absolute -inset-3 rounded-full" aria-hidden />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/90 to-blue-500/85 text-white shadow-inner sm:h-11 sm:w-11">
        <Sparkles className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.85} aria-hidden />
      </span>
      {showNotify ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
          <span className="relative h-3 w-3 rounded-full border-2 border-background bg-accent" />
        </span>
      ) : null}
    </motion.button>
  );
}

export function ProDocAssistant() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const stacksWithProFeed =
    pathname?.startsWith("/docs") || pathname?.startsWith("/prodoc");
  const panelTitleId = useId();
  const inputId = useId();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeChipId, setActiveChipId] = useState<AssistantCommandId | null>(null);
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(MESSAGES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          initializedRef.current = true;
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const scrollMessagesToEnd = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("prodoc-assistant-seen");
    if (!seen) {
      const t = window.setTimeout(() => setShowNotify(true), 2200);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    scrollMessagesToEnd();
  }, [messages, busy, scrollMessagesToEnd]);

  useEffect(() => {
    if (open && !minimized) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 260);
      return () => window.clearTimeout(t);
    }
  }, [open, minimized]);

  const seedConversation = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setMessages([
      {
        id: nextId(),
        role: "assistant",
        content: assistantMeta.greeting,
      },
      {
        id: nextId(),
        role: "assistant",
        content: assistantMeta.prompt,
        chips: INITIAL_CHIPS,
      },
    ]);
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    setMinimized(false);
    setShowNotify(false);
    sessionStorage.setItem("prodoc-assistant-seen", "1");
    seedConversation();
  }, [seedConversation]);

  const toggleOpen = useCallback(() => {
    if (minimized) {
      setMinimized(false);
      return;
    }
    if (open) {
      setOpen(false);
      setMinimized(false);
    } else {
      openPanel();
    }
  }, [open, minimized, openPanel]);

  const streamAssistantReply = useCallback(
    async (
      nextMessages: ChatMessage[],
      apiHistory: { role: string; content: string }[],
      linkCommand?: AssistantCommandId | null,
    ) => {
      const assistantId = nextId();
      setMessages([
        ...nextMessages,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiHistory, stream: true }),
        });

        if (!res.ok || !res.body) throw new Error("chat failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let reply = "";
        let command: AssistantCommandId | null | undefined = linkCommand;
        let chips: AssistantChip[] = INITIAL_CHIPS.slice(0, 4);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const json = line.slice(5).trim();
            if (!json) continue;

            const event = JSON.parse(json) as {
              type?: string;
              text?: string;
              reply?: string;
              command?: AssistantCommandId | null;
              chips?: AssistantChip[];
            };

            if (event.type === "text" && event.text) {
              reply += event.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: reply } : m,
                ),
              );
            } else if (event.type === "done") {
              command = event.command ?? linkCommand;
              if (Array.isArray(event.chips) && event.chips.length) {
                chips = event.chips;
              }
            } else if (event.type === "error") {
              reply =
                event.reply ??
                "Sorry, I couldn't reach the AI service right now. Please try again.";
              if (Array.isArray(event.chips) && event.chips.length) {
                chips = event.chips;
              }
              command = event.command ?? linkCommand;
            }
          }
        }

        if (!reply.trim()) {
          reply =
            "I'm not sure about that — try asking about ProDoc, ProFeed, or the documentation platform.";
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: reply.trim(),
                  chips,
                  actionLink: getCommandActionLink(command ?? linkCommand),
                }
              : m,
          ),
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Sorry, I couldn't connect right now. Please try again.",
                  chips: INITIAL_CHIPS.slice(0, 4),
                }
              : m,
          ),
        );
      }
    },
    [],
  );

  const handleChip = useCallback(
    (commandId: AssistantCommandId) => {
      if (busy) return;

      const displayLabel = getCommandLabel(commandId);
      const geminiText = CHIP_GEMINI_MESSAGES[commandId] ?? displayLabel;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: displayLabel,
        chipCommandId: commandId,
      };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setActiveChipId(commandId);
      setBusy(true);

      const apiHistory = nextMessages.map((m) => ({
        role: m.role,
        content: m === userMsg ? geminiText : m.content,
      }));

      void streamAssistantReply(nextMessages, apiHistory, commandId).finally(() => {
        setBusy(false);
        setActiveChipId(null);
      });
    },
    [busy, messages, streamAssistantReply],
  );

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setDraft("");

      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setBusy(true);

      const apiHistory = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        await streamAssistantReply(nextMessages, apiHistory);
      } finally {
        setBusy(false);
        setActiveChipId(null);
      }
    },
    [busy, messages, streamAssistantReply],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendText(draft);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendText(draft);
    }
  };

  if (pathname?.startsWith("/proapi")) return null;

  return (
    <div
      className={`prodoc-assistant-root pointer-events-none fixed z-[105] flex flex-col items-end gap-3 sm:right-5 ${
        stacksWithProFeed
          ? "max-sm:right-3 max-sm:bottom-[5.5rem] bottom-28 sm:bottom-32"
          : "max-lg:right-3 max-lg:bottom-20 bottom-3 lg:bottom-5"
      }`}
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        paddingRight: "max(0rem, env(safe-area-inset-right))",
      }}
    >
      <AnimatePresence mode="popLayout">
        {open && !minimized ? (
          <motion.section
            key="panel"
            role="dialog"
            aria-labelledby={panelTitleId}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.94, originX: 1, originY: 1 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.96 }
            }
            transition={PANEL_SPRING}
            className="prodoc-assistant-panel pointer-events-auto flex w-[min(calc(100vw-1.5rem),21.5rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-[0_16px_48px_rgba(124,34,206,0.14)] backdrop-blur-2xl sm:w-[21.5rem]"
            style={{ maxHeight: "min(68dvh, 30rem)" }}
          >
            <header className="flex shrink-0 items-center gap-2 border-b border-border/50 px-3.5 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id={panelTitleId}
                  className="truncate text-sm font-semibold text-foreground"
                >
                  {assistantMeta.title}
                </h2>
                <p className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
                    aria-hidden
                  />
                  Gemini AI
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Minimize"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            <div
              className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-3"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onChipSelect={handleChip}
                  chipsDisabled={busy}
                  activeChipId={activeChipId}
                />
              ))}
              <div ref={messagesEndRef} className="h-px shrink-0" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-border/50 p-2.5"
            >
              <label htmlFor={inputId} className="sr-only">
                Message
              </label>
              <div className="flex items-end gap-1.5 rounded-xl border border-border/70 bg-background/60 p-1.5 focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/25">
                <textarea
                  id={inputId}
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  disabled={busy}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={assistantMeta.inputPlaceholder}
                  className="max-h-20 min-h-[2rem] flex-1 resize-none bg-transparent px-1 py-1 text-[0.8125rem] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={busy || !draft.trim()}
                  aria-label="Send"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.25} />
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[0.625rem] leading-snug text-muted-foreground">
                Answers are grounded in this site&apos;s documentation.
              </p>
            </form>
          </motion.section>
        ) : null}

        {open && minimized ? (
          <motion.button
            key="minibar"
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => setMinimized(false)}
            className="pointer-events-auto flex w-[min(calc(100vw-1.5rem),21.5rem)] items-center justify-between rounded-2xl border border-border/70 bg-card/75 px-3 py-2.5 text-left backdrop-blur-xl"
          >
            <span className="text-sm font-medium">{assistantMeta.title}</span>
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-auto">
        <AssistantLauncher
          onClick={toggleOpen}
          showNotify={showNotify && !open}
          reducedMotion={!!reducedMotion}
          expanded={open}
        />
      </div>
    </div>
  );
}
