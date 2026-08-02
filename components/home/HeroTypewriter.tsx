"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const TYPE_MS = 65;
const DELETE_MS = 38;
const PAUSE_AFTER_TYPE_MS = 2200;
const PAUSE_AFTER_DELETE_MS = 280;

type HeroTypewriterProps = {
  words: readonly string[];
};

export function HeroTypewriter({ words }: HeroTypewriterProps) {
  const reduceMotion = useReducedMotion();
  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words],
  );

  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState(words[0] ?? "");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    if (reduceMotion) {
      setDisplayed(words[0] ?? "");
      setWordIndex(0);
      setIsDeleting(false);
      return;
    }

    const full = words[wordIndex] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed === full) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE_MS);
    } else if (isDeleting && displayed === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, PAUSE_AFTER_DELETE_MS);
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayed(full.slice(0, Math.max(0, displayed.length - 1)));
      }, DELETE_MS);
    } else {
      timeout = setTimeout(() => {
        setDisplayed(full.slice(0, displayed.length + 1));
      }, TYPE_MS);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, reduceMotion]);

  return (
    <span
      className="hero-typewriter"
      style={{ minWidth: `${longestWord.length}ch` }}
      aria-live="polite"
    >
      <span className="hero-typewriter-word">{displayed}</span>
      <span className="cursor hero-typewriter-cursor" aria-hidden />
    </span>
  );
}
