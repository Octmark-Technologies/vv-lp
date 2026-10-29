"use client";

import { useEffect, useState } from "react";
import { Star } from "./Terms";
import "./countdown.css";

/**
 * Pay 5% offer countdown · to 31 Dec 2026, 23:59:59 IST (bookings till 31 Dec 2026).
 *
 * - <OfferCountdown variant="hero"> sits on each page's first screen and is marked
 *   [data-countdown-hero].
 * - <OfferCountdown variant="bar"> sits in the sticky top bar and appears only once the hero
 *   countdown is out of sight (scrolled past, faded out by the opening, or not rendered).
 * Renders nothing until mounted (no server/client clock mismatch) and nothing after the deadline.
 */
export const OFFER_END = new Date("2026-12-31T23:59:59+05:30").getTime();

type Left = { d: number; h: number; m: number; s: number };

function useLeft(): Left | null | "over" {
  const [left, setLeft] = useState<Left | null | "over">(null);
  useEffect(() => {
    const tick = () => {
      const ms = OFFER_END - Date.now();
      if (ms <= 0) return setLeft("over");
      const t = Math.floor(ms / 1000);
      setLeft({ d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** True while the hero countdown can be seen: rendered, on screen, and not faded out. */
function heroInView(): boolean {
  const el = document.querySelector<HTMLElement>("[data-countdown-hero]");
  if (!el) return false;
  const r = el.getBoundingClientRect();
  // The fixed bottom bars (fact rail, Call · WhatsApp · Enquire) cover the bottom of the screen.
  let limit = innerHeight;
  document.querySelectorAll<HTMLElement>('.sv-rail, nav[aria-label="Quick contact"]').forEach((b) => {
    const br = b.getBoundingClientRect();
    if (br.height > 0 && br.top > innerHeight / 2) limit = Math.min(limit, br.top);
  });
  if (r.height === 0 || r.bottom < 72 || r.top + r.height * 0.6 > limit) return false;
  for (let n: HTMLElement | null = el; n && n !== document.body; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (cs.visibility === "hidden" || Number(cs.opacity) < 0.25) return false;
  }
  return true;
}

function useBarVisible() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setShow(!heroInView());
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);
  return show;
}

export function OfferCountdown({ variant, tone = "light", className = "" }: { variant: "hero" | "bar"; tone?: "light" | "dark"; className?: string }) {
  const left = useLeft();
  const barShow = useBarVisible();

  if (left === "over") return null;

  if (variant === "hero") {
    const units: [string, number | null][] = [
      ["Days", left ? left.d : null],
      ["Hrs", left ? left.h : null],
      ["Min", left ? left.m : null],
      ["Sec", left ? left.s : null],
    ];
    return (
      <div data-countdown-hero className={`sv-cd sv-cd-${tone} ${className}`} role="timer" aria-live="off">
        <p className="sv-cd-label">
          Pay 5% offer ends in
          <Star />
        </p>
        <ol className="sv-cd-units sv-tnum">
          {units.map(([k, v]) => (
            <li key={k}>
              <strong>{v === null ? "--" : k === "Days" ? v : pad(v)}</strong>
              <span>{k}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (!left) return null;
  return (
    <p className={`sv-cd-bar sv-tnum ${barShow ? "is-on" : ""} ${className}`} role="timer" aria-live="off" aria-hidden={!barShow}>
      <span className="sv-cd-bar-label">Offer ends in</span>{" "}
      <strong>
        {left.d}d {pad(left.h)}h {pad(left.m)}m<span className="sv-cd-bar-sec"> {pad(left.s)}s</span>
      </strong>
    </p>
  );
}
