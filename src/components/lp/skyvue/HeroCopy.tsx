"use client";

import { useSearchParams } from "next/navigation";
import type { HeroCopy as Copy, Version } from "@/data/skyvue-landing";
import { withStar } from "./Terms";

type Tone = "dark" | "light";

/**
 * Picks the hero message version from ?v= (buyer | family | parents, plus any extra versions a
 * page defines, e.g. LP2's deadline | buyers | upgrade | nri | plan). Unknown values fall back
 * to the page default.
 */
export function HeroCopy({ copies, fallback, tone = "dark", kicker }: { copies: Record<Version, Copy> & Partial<Record<string, Copy>>; fallback: Version; tone?: Tone; kicker?: string }) {
  const v = useSearchParams().get("v");
  const pick = v && Object.prototype.hasOwnProperty.call(copies, v) ? copies[v] : undefined;
  return <HeroText copy={pick ?? copies[fallback]} tone={tone} kicker={kicker} />;
}

/**
 * tone "dark" = white text on a dark photo; tone "light" = navy text on the sky gradient.
 * kicker: an optional search-keyword line shown first inside the h1 (e.g. "3 BHK Flats for Sale
 * in Tellapur" on LP2, for Google Ads landing-page relevance); the ad-matched headline follows it.
 */
export function HeroText({ copy, tone = "dark", kicker }: { copy: Copy; tone?: Tone; kicker?: string }) {
  const light = tone === "light";
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sv-orange sm:text-xs">
        {/* Phones show only the first part of the eyebrow, so it stays on one line. */}
        {copy.eyebrow.split(" · ").map((part, i) => (
          <span key={i} className={i ? "max-sm:hidden" : undefined}>
            {i ? " · " : ""}
            {part}
          </span>
        ))}
      </p>
      <h1
        className={`mt-4 max-w-2xl text-[36px] leading-[1.06] tracking-tight sm:text-5xl lg:text-[64px] ${
          light ? "text-[var(--sv-heading,#004670)] [font-family:var(--sv-display,inherit)] font-normal" : "[font-family:var(--sv-display,inherit)] font-normal text-white"
        }`}
      >
        {kicker && <span className="sv-h1-kicker">{kicker}</span>}
        {kicker ? <span className="block">{withStar(copy.title)}</span> : withStar(copy.title)}
      </h1>
      <p className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${light ? "text-[var(--sv-muted,rgba(39,39,38,0.72))]" : "text-white/80"}`}>{withStar(copy.sub)}</p>
      {copy.size && (
        <p className={`sv-size-line mt-4 max-w-xl text-[17px] font-medium leading-snug sm:text-[20px] ${light ? "text-[var(--sv-heading,#004670)]" : "text-white"}`}>
          <SizeLine text={copy.size} />
        </p>
      )}
    </>
  );
}

/** Numbers in the size line (2,010 · 2,890) carry data-count so the page can count them up on arrival. */
function SizeLine({ text }: { text: string }) {
  const parts = text.split(/(\d{1,3}(?:,\d{3})+|\d{4,})/);
  return (
    <>
      {parts.map((t, i) =>
        /^\d/.test(t) ? (
          <span key={i} data-count={t.replace(/,/g, "")} className="sv-tnum font-semibold">
            {t}
          </span>
        ) : (
          <span key={i}>{t}</span>
        ),
      )}
    </>
  );
}
