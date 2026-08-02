"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

/**
 * Web Speech API — appends transcript to message (caller merges into editor or state).
 */
export function VoiceInputButton({ onTranscript, disabled }: Props) {
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const recRef = useRef<AnyRecognition | null>(null);

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    setErr(null);
    const w =
      typeof window !== "undefined" ? (window as unknown as AnyWin) : null;
    const SR = w ? w.SpeechRecognition || w.webkitSpeechRecognition : null;
    if (!SR) {
      setErr("Voice input is not supported in this browser.");
      return;
    }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev: AnyResult) => {
      const t = ev.results[0]?.[0]?.transcript?.trim();
      if (t) onTranscript(t);
    };
    r.onerror = () => {
      setErr("Could not capture speech.");
      stop();
    };
    r.onend = () => {
      setListening(false);
      recRef.current = null;
    };
    recRef.current = r as AnyRecognition;
    r.start();
    setListening(true);
  }, [onTranscript, stop]);

  const toggle = () => {
    if (disabled) return;
    if (listening) stop();
    else start();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition",
          listening
            ? "border-rose-500/60 bg-rose-500/10 text-rose-800 dark:text-rose-200"
            : "border-border/80 bg-card text-foreground/80 hover:bg-muted dark:border-border dark:bg-muted ",
          disabled && "opacity-50",
        )}
      >
        <span aria-hidden>{listening ? "⏹" : "🎤"}</span>
        {listening ? "Stop" : "Voice to text"}
      </button>
      {err ? (
        <span className="text-xs text-rose-600 dark:text-rose-400">{err}</span>
      ) : null}
    </div>
  );
}

// Minimal typing for the Web Speech API (not in all TS lib targets).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWin = { SpeechRecognition?: any; webkitSpeechRecognition?: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyResult = any;
