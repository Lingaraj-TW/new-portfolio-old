"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const STATIC_PREFIX = "Building ";

const PHRASES = [
  "Documentation Platforms",
  "Knowledge Systems",
  "AI Documentation Experiences",
  "Documentation Ecosystems",
] as const;

const LONGEST_PHRASE = PHRASES.reduce(
  (longest, phrase) => (phrase.length > longest.length ? phrase : longest),
  PHRASES[0],
);

const PAUSE_MS = 1500;
const TARGET_TYPE_MS = 1350;
const TARGET_ERASE_MS = 900;

type Phase = "typing" | "pause" | "erasing";

function getStepDelay(charCount: number, targetMs: number): number {
  return Math.min(48, Math.max(28, targetMs / Math.max(charCount, 1)));
}

type StrategicEvolutionProps = {
  className?: string;
};

export function StrategicEvolution({ className = "" }: StrategicEvolutionProps) {
  const reduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const phrase = PHRASES[phraseIndex];
  const visiblePhrase = phrase.slice(0, charIndex);

  const typeDelay = useMemo(
    () => getStepDelay(phrase.length, TARGET_TYPE_MS),
    [phrase.length],
  );
  const eraseDelay = useMemo(
    () => getStepDelay(phrase.length, TARGET_ERASE_MS),
    [phrase.length],
  );

  useEffect(() => {
    if (!reduceMotion) return;
    setPhraseIndex(0);
    setCharIndex(PHRASES[0].length);
    setPhase("pause");
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    if (phase === "typing") {
      if (charIndex >= phrase.length) {
        setPhase("pause");
        return;
      }

      const timeout = setTimeout(() => {
        setCharIndex((count) => count + 1);
      }, typeDelay);

      return () => clearTimeout(timeout);
    }

    if (phase === "pause") {
      const timeout = setTimeout(() => setPhase("erasing"), PAUSE_MS);
      return () => clearTimeout(timeout);
    }

    if (charIndex <= 0) {
      setPhraseIndex((index) => (index + 1) % PHRASES.length);
      setPhase("typing");
      return;
    }

    const timeout = setTimeout(() => {
      setCharIndex((count) => count - 1);
    }, eraseDelay);

    return () => clearTimeout(timeout);
  }, [phase, charIndex, phrase.length, typeDelay, eraseDelay, reduceMotion]);

  const showCursor = !reduceMotion;

  return (
    <p
      className={`strategic-evolution ${className}`.trim()}
      aria-live="polite"
    >
      <span className="strategic-evolution__row">
        <span className="strategic-evolution__static">{STATIC_PREFIX}</span>
        <span className="strategic-evolution__slot">
          <span className="strategic-evolution__ghost" aria-hidden>
            {LONGEST_PHRASE}
          </span>
          <span className="strategic-evolution__active">
            <span className="strategic-evolution__phrase">{visiblePhrase}</span>
            {showCursor ? (
              <span className="strategic-evolution__cursor" aria-hidden>
                |
              </span>
            ) : null}
          </span>
        </span>
      </span>
    </p>
  );
}
