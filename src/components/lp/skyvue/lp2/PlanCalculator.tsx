"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { units } from "@/data/skyvue-landing";
import { howItWorks, lp2, PRICE } from "@/data/skyvue-lp2";
import { revealOnEnter, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { useHomeSize } from "./useHomeSize";
import { Star } from "../Terms";

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

/** ₹ in crore (≥ 1 Cr) or lakh, as Indian buyers read prices. */
function inr(n: number) {
  return n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(1)} lakh`;
}

/**
 * LP2 · "Your price, by size" (Pay Your Way). Pick a home size; see the base price at the one
 * public price, ₹7,399 per sq ft. Base price only (GST and other charges extra); no negotiated rate
 * is ever shown. The only dated part of the offer is no-cost EMI on bookings till 31 Dec 2026.
 * The size travels with the lead (sv_size). The deadline is real: days left until 31 Dec 2026.
 */
export function PlanCalculator() {
  const ref = useRef<HTMLElement>(null);
  const [size, pick] = useHomeSize();
  const days = useDaysLeft(lp2.offerEnds);
  useAnime(ref, revealOnEnter);

  const choose = (n: number) => {
    pick(n);
    (window.dataLayer = window.dataLayer || []).push({ event: "calculator_used", lp_id: lp2.id, home_size: n });
  };
  const base = size * PRICE;

  return (
    <section ref={ref} className="sv-section sv-sky" aria-labelledby="calc-title" id="your-price">
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <h2 id="calc-title" className="text-[30px] leading-[1.1] text-[var(--sv-heading)] sm:text-[44px]" data-reveal>
            <span className="sv-eyebrow block">{lp2.kw.price}</span>
            <span className="mt-3 block">Pick your home. See what it takes to make it yours.</span>
          </h2>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[var(--sv-muted)]" data-reveal>
            Explore 7 exclusive 3 BHK apartment sizes at Vaishno SkyVue, Tellapur, starting at ₹7,399/sq. ft. Get a personalised price quote with flexible payment options tailored to your schedule.
          </p>
          <p className="sv-offer mt-6 inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-[14px]" data-reveal>
            <span className="sv-offer-dot" aria-hidden="true" />
            {days === null ? (
              <span>No-cost EMI on bookings till 31 December 2026</span>
            ) : days > 0 ? (
              <span>
                No-cost EMI for <strong className="sv-tnum text-[var(--sv-orange)]">{days} more days</strong>, till 31 Dec 2026
              </span>
            ) : (
              <span>₹7,399 per sq ft. Ask us about current offers</span>
            )}
          </p>
          <figure className="sv-calc-view mt-8" data-reveal>
            <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl">
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
                className={`sv-tnum relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${u.size === size ? "text-white" : "text-[var(--sv-heading)] hover:bg-[var(--sv-mist)]"}`}
              >
                {u.size === size && <motion.span layoutId="sv-calc-pill" className="absolute inset-0 rounded-full bg-[var(--sv-navy)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{u.size.toLocaleString("en-IN")} sq ft</span>
              </button>
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <dt className="text-[13px] text-[var(--sv-muted)]">Base price</dt>
              <dd className="sv-display sv-tnum mt-1 text-[32px] font-light leading-none text-[var(--sv-orange)] sm:text-[40px]">{inr(base)}</dd>
              <dd className="sv-tnum mt-1 text-[12px] text-[var(--sv-muted)]">at ₹7,399 per sq ft</dd>
            </div>
            <div>
              <dt className="text-[13px] text-[var(--sv-muted)]">No-cost EMI</dt>
              <dd className="sv-display mt-1 text-[32px] font-light leading-none text-[var(--sv-ink)] sm:text-[40px]">Till 31 Dec</dd>
              <dd className="sv-tnum mt-1 text-[12px] text-[var(--sv-muted)]">on bookings made in 2026<Star /></dd>
            </div>
          </dl>
          <ol className="mt-5 grid gap-1.5 text-[14px] text-[var(--sv-ink)]" aria-label="How Pay Your Way works">
            {howItWorks.map((h, i) => (
              <li key={h.t}>
                <span className="sv-tnum font-semibold">{i + 1}.</span> {h.t}
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => openEnquiry("calculator", "payment_schedule")} className="sv-btn sv-btn-primary mt-6 w-full sm:w-auto">
            Get my quote
          </button>
          <p className="mt-4 text-[12px] leading-relaxed text-[var(--sv-muted)]">
            Base price before GST, parking and other charges, which your quote lists.{" "}
            <a href="#terms" className="underline underline-offset-2">
              *Price terms
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
