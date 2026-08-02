"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const TYPE_MS = 58;
const BLINK_MS = 260;
const NAME_EXTRA_BLINKS = 2;
const SUBTITLE_EXTRA_BLINKS = 5;

type Phase =
  | "typing-name"
  | "blink-name"
  | "typing-subtitle"
  | "blink-subtitle"
  | "done";

type NavBrandTypewriterProps = {
  name: string;
  subtitle: string;
};

export function NavBrandTypewriter({ name, subtitle }: NavBrandTypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(
    reduceMotion ? "done" : "typing-name",
  );
  const [nameText, setNameText] = useState(reduceMotion ? name : "");
  const [subtitleText, setSubtitleText] = useState(reduceMotion ? subtitle : "");
  const [nameIndex, setNameIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [blinkTicks, setBlinkTicks] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("done");
      setNameText(name);
      setSubtitleText(subtitle);
      setCursorVisible(false);
    }
  }, [reduceMotion, name, subtitle]);

  useEffect(() => {
    if (phase !== "typing-name") return;

    if (nameIndex >= name.length) {
      setNameText(name);
      setBlinkTicks(0);
      setCursorVisible(true);
      setPhase("blink-name");
      return;
    }

    const timeout = setTimeout(() => {
      setNameText(name.slice(0, nameIndex + 1));
      setNameIndex((index) => index + 1);
    }, TYPE_MS);

    return () => clearTimeout(timeout);
  }, [phase, nameIndex, name]);

  useEffect(() => {
    if (phase !== "typing-subtitle") return;

    if (subtitleIndex >= subtitle.length) {
      setSubtitleText(subtitle);
      setBlinkTicks(0);
      setCursorVisible(true);
      setPhase("blink-subtitle");
      return;
    }

    const timeout = setTimeout(() => {
      setSubtitleText(subtitle.slice(0, subtitleIndex + 1));
      setSubtitleIndex((index) => index + 1);
    }, TYPE_MS);

    return () => clearTimeout(timeout);
  }, [phase, subtitleIndex, subtitle]);

  useEffect(() => {
    if (phase !== "blink-name" && phase !== "blink-subtitle") return;

    const extraBlinks =
      phase === "blink-name" ? NAME_EXTRA_BLINKS : SUBTITLE_EXTRA_BLINKS;
    const totalTicks = extraBlinks * 2;
    if (blinkTicks >= totalTicks) {
      if (phase === "blink-name") {
        setSubtitleIndex(0);
        setSubtitleText("");
        setBlinkTicks(0);
        setCursorVisible(true);
        setPhase("typing-subtitle");
      } else {
        setCursorVisible(false);
        setPhase("done");
      }
      return;
    }

    const timeout = setTimeout(() => {
      setCursorVisible((visible) => !visible);
      setBlinkTicks((count) => count + 1);
    }, BLINK_MS);

    return () => clearTimeout(timeout);
  }, [phase, blinkTicks]);

  const showNameCursor =
    phase === "typing-name" || (phase === "blink-name" && cursorVisible);
  const showSubtitleCursor =
    phase === "typing-subtitle" ||
    (phase === "blink-subtitle" && cursorVisible);

  return (
    <span className="nav-brand-typewriter flex min-w-0 flex-col justify-center gap-px overflow-hidden">
      <span
        className="nav-brand-name leading-tight"
        style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}
      >
        {nameText}
        {showNameCursor ? (
          <span className="nav-typewriter-cursor nav-typewriter-cursor--name" aria-hidden />
        ) : null}
      </span>
      <span className="nav-brand-subtitle nav-brand-subtitle--gradient block leading-tight">
        {subtitleText}
        {showSubtitleCursor ? (
          <span
            className="nav-typewriter-cursor nav-typewriter-cursor--subtitle"
            aria-hidden
          />
        ) : null}
      </span>
    </span>
  );
}
