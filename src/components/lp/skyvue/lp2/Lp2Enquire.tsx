"use client";

import { useRef } from "react";
import { skyvue } from "@/data/skyvue-landing";
import { lp2 } from "@/data/skyvue-lp2";
import { revealOnEnter, useAnime } from "../lp1/anim";
import { Star } from "../Terms";
import { ScheduleForm } from "./ScheduleForm";

/** LP2 · the main conversion block: the 3-step form beside Pay Your Way in 3 steps. */
export function Lp2Enquire() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} id="enquire" className="sv-section sv-sky" aria-labelledby="enq-title">
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <h2 id="enq-title" className="text-[30px] leading-[1.1] text-[var(--sv-heading)] sm:text-[44px]" data-reveal>
            <span className="sv-eyebrow block">{lp2.kw.enquire}</span>
            <span className="mt-3 block">Bring your plan. Leave with a quote.</span>
          </h2>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-[var(--sv-muted)]" data-reveal>
            Planning to buy a 3 BHK flat in Tellapur? Explore the available apartment sizes, review the floor plans and request a personalised price quote at Vaishno SkyVue. Book a site visit to experience the homes, amenities and lifestyle firsthand.
          </p>
          <p className="mt-6 text-[14px] text-[var(--sv-muted)]" data-reveal>
            ₹7,399 per sq ft. No-cost EMI on bookings till 31 Dec 2026.
            <Star /> TS RERA {skyvue.rera}.
          </p>
        </div>
        <div data-reveal>
          <ScheduleForm formId={`${lp2.id}-steps`} />
        </div>
      </div>
    </section>
  );
}
