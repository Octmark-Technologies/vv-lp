"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { motion } from "motion/react";
import { formatCr, formatLakh, skyvue, units } from "@/data/skyvue-landing";
import { lp2 } from "@/data/skyvue-lp2";
import { motionOn, revealOnEnter, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { useHomeSize } from "./useHomeSize";
import { Star } from "../Terms";

/** A number that counts to its new value whenever it changes (anime.js); static without motion. */
function Counter({ value, format }: { value: number; format: (n: number) => string }) {
  const el = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (!motionOn()) {
      node.textContent = format(value);
      from.current = value;
      return;
    }
    const box = { v: from.current };
    const a = animate(box, { v: value, duration: 700, ease: "outExpo", onUpdate: () => (node.textContent = format(box.v)) });
    from.current = value;
    return () => {
      a.pause();
    };
  }, [value, format]);
  return (
    <span ref={el} className="sv-tnum">
      {format(value)}
    </span>
  );
}

function useDaysLeft(iso: string) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const calc = () => setDays(Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)));
    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, [iso]);
  return days;
}

/**
 * LP2 · "Your 5%, by size". Pick a home size; the base value and the 5% booking amount count
 * to the new figures. The size travels with the lead (sv_size) and into the payment scene.
 * The deadline is real: days left until 31 Dec 2026.
 */
export function PlanCalculator() {
  const ref = useRef<HTMLElement>(null);
  const [size, pick] = useHomeSize();
  const days = useDaysLeft(lp2.offerEnds);
  useAnime(ref, revealOnEnter);

  const value = size * skyvue.basePrice;
  const choose = (n: number) => {
    pick(n);
    (window.dataLayer = window.dataLayer || []).push({ event: "calculator_used", lp_id: lp2.id, home_size: n });
  };

  return (
    <section ref={ref} className="sv-section sv-sky" aria-labelledby="calc-title" id="your-5">
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <p className="sv-eyebrow" data-reveal>
            Your 5%, by size
          </p>
          <h2 id="calc-title" className="mt-3 text-[30px] leading-[1.1] text-[var(--sv-ink)] sm:text-[44px]" data-reveal>
            Pick your home. See what it takes to make it yours.
          </h2>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[var(--sv-muted)]" data-reveal>
            Every home is an exclusive 3 BHK with a study, from 2,010 to 2,890 sq ft. Pay 5% to book, then nothing more until your block&apos;s
            structure is complete.
            <Star /> No-cost EMI.
            <Star />
          </p>
          <p className="sv-offer mt-6 inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-[14px]" data-reveal>
            <span className="sv-offer-dot" aria-hidden="true" />
            {days === null ? (
              <span>Offer on bookings till {skyvue.offer.validTill}</span>
            ) : days > 0 ? (
              <span>
                Offer ends in <strong className="sv-tnum text-[var(--sv-orange)]">{days} days</strong>, on {skyvue.offer.validTill}
              </span>
            ) : (
              <span>Offer closed on {skyvue.offer.validTill}</span>
            )}
          </p>
          <figure className="sv-calc-view mt-8" data-reveal>
            <span className="relative block aspect-[16/9] overflow-hidden">
              <Image src="/lp/skyvue/fr/balcony.webp" alt="A SkyVue balcony looking out over Tellapur" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </span>
            <figcaption className="mt-2 text-[12px] text-[var(--sv-muted)]">The view you are booking: a SkyVue balcony</figcaption>
          </figure>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-8" data-reveal>
          <p className="text-[13px] font-semibold text-[var(--sv-muted)]" id="calc-sizes">
            Home size
          </p>
          <div role="radiogroup" aria-labelledby="calc-sizes" className="mt-3 flex flex-wrap gap-2">
            {units.map((u) => (
              <button
                key={u.size}
                type="button"
                role="radio"
                aria-checked={u.size === size}
                onClick={() => choose(u.size)}
                className={`sv-tnum relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${u.size === size ? "text-white" : "text-[var(--sv-navy)] hover:bg-[var(--sv-mist)]"}`}
              >
                {u.size === size && <motion.span layoutId="sv-calc-pill" className="absolute inset-0 rounded-full bg-[var(--sv-navy)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{u.size.toLocaleString("en-IN")} sq ft</span>
              </button>
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <dt className="text-[13px] text-[var(--sv-muted)]">Base value</dt>
              <dd className="sv-display mt-1 text-[32px] font-light leading-none text-[var(--sv-ink)] sm:text-[40px]">
                <Counter value={value} format={(n) => formatCr(n)} />
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-[var(--sv-muted)]">
                5% to book
                <Star />
              </dt>
              <dd className="sv-display mt-1 text-[32px] font-light leading-none text-[var(--sv-orange)] sm:text-[40px]">
                <Counter value={value * 0.05} format={(n) => formatLakh(n)} />
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[14px] text-[var(--sv-ink)]">
            Then nothing more to pay until your block&apos;s structure is complete.
            <Star /> No-cost EMI on what follows.
            <Star />
          </p>
          <button type="button" onClick={() => openEnquiry("calculator", "payment_schedule")} className="sv-btn sv-btn-primary mt-6 w-full sm:w-auto">
            Get the payment schedule for {size.toLocaleString("en-IN")} sq ft
          </button>
          <p className="mt-4 text-[12px] leading-relaxed text-[var(--sv-muted)]">
            Approximate, on the base price of ₹{skyvue.basePrice.toLocaleString("en-IN")} per sq ft only. GST, parking and other charges are extra. Your cost sheet shows the
            exact booking amount for your home.{" "}
            <a href="#terms" className="underline underline-offset-2">
              *Conditions apply
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
