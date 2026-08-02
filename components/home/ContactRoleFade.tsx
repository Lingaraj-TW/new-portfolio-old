"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const HOLD_MS = 2800;
const FADE_MS = 350;

type ContactRoleFadeProps = {
  words: readonly string[];
};

export function ContactRoleFade({ words }: ContactRoleFadeProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (words.length <= 1) return;

    if (reduceMotion) {
      const interval = window.setInterval(() => {
        setIndex((i) => (i + 1) % words.length);
      }, 3000);
      return () => window.clearInterval(interval);
    }

    let cancelled = false;
    let holdTimer: number | undefined;
    let swapTimer: number | undefined;

    const cycle = () => {
      if (cancelled) return;
      holdTimer = window.setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        swapTimer = window.setTimeout(() => {
          if (cancelled) return;
          setIndex((i) => (i + 1) % words.length);
          setVisible(true);
          cycle();
        }, FADE_MS);
      }, HOLD_MS);
    };

    cycle();

    return () => {
      cancelled = true;
      window.clearTimeout(holdTimer);
      window.clearTimeout(swapTimer);
    };
  }, [words.length, reduceMotion]);

  const showWord = reduceMotion || visible;

  return (
    <span className="contact-role-fade" aria-live="polite">
      <span
        className={`contact-role-fade__word ${
          showWord ? "contact-role-fade__word--visible" : "contact-role-fade__word--hidden"
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}
