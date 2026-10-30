"use client";

import { useEffect, useState } from "react";
import "./scrollcue.css";

/**
 * "Scroll" heads-up on the first screen: a vertical label with a line that keeps flowing down,
 * fixed on the left edge (clear of the hero copy, the countdown, WhatsApp and the bottom bar).
 * It fades out as soon as the visitor scrolls and comes back only at the very top.
 * Tapping it moves the page down by most of a screen. Reduced motion: a still line.
 */
export function ScrollCue({ tone = "light", onImage = false, right = false }: { tone?: "light" | "dark"; /** phones: sit over the hero image at the top (LP2) */ onImage?: boolean; /** phones: right edge instead of left (LP3, where the hero copy runs down the left) */ right?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setShow(window.scrollY < 40);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    // Appear a beat after load so it reads as a hint, not part of the layout.
    const t = setTimeout(check, 900);
    addEventListener("scroll", on, { passive: true });
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
    };
  }, []);

  return (
    <button
      type="button"
      className={`sv-cue sv-cue-${tone} ${onImage ? "sv-cue-onimage" : ""} ${right ? "sv-cue-right" : ""} ${show ? "is-on" : ""}`}
      aria-label="Scroll down to explore"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollBy({ top: Math.round(window.innerHeight * 0.85), behavior: "smooth" })}
    >
      <span className="sv-cue-label">Scroll</span>
      <span className="sv-cue-track" aria-hidden="true">
        <span className="sv-cue-dot" />
      </span>
    </button>
  );
}
