"use client";

import { useSearchParams } from "next/navigation";
import type { HeroCopy as Copy, Version } from "@/data/skyvue-landing";
import { withStar } from "./Terms";

const isVersion = (v: string | null): v is Version => v === "buyer" || v === "family" || v === "parents";

type Tone = "dark" | "light";

/** Picks the hero message version from ?v=buyer|family|parents (falls back to the page default). */
export function HeroCopy({ copies, fallback, tone = "dark" }: { copies: Record<Version, Copy>; fallback: Version; tone?: Tone }) {
  const v = useSearchParams().get("v");
  return <HeroText copy={copies[isVersion(v) ? v : fallback]} tone={tone} />;
}

/** tone "dark" = white text on a dark photo; tone "light" = navy text on the sky gradient. */
export function HeroText({ copy, tone = "dark" }: { copy: Copy; tone?: Tone }) {
  const light = tone === "light";
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sv-orange sm:text-xs">{copy.eyebrow}</p>
      <h1
        className={`mt-4 max-w-2xl text-[36px] leading-[1.06] tracking-tight sm:text-5xl lg:text-[64px] ${
          light ? "text-[var(--sv-ink,#0b2540)] [font-family:var(--sv-display,inherit)] font-light" : "font-sans font-light text-white"
        }`}
      >
        {withStar(copy.title)}
      </h1>
      <p className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${light ? "text-[var(--sv-muted,#5a6b7c)]" : "text-white/80"}`}>{withStar(copy.sub)}</p>
      {copy.size && (
        <p className={`sv-size-line mt-4 max-w-xl text-[17px] font-medium leading-snug sm:text-[20px] ${light ? "text-[var(--sv-navy,#00355d)]" : "text-white"}`}>
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
