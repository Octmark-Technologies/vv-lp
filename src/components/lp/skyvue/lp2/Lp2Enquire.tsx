"use client";

import { useRef } from "react";
import { trackRecord, skyvue } from "@/data/skyvue-landing";
import { lp2 } from "@/data/skyvue-lp2";
import { revealOnEnter, useAnime } from "../lp1/anim";
import { Star } from "../Terms";
import { ScheduleForm } from "./ScheduleForm";
import { useHomeSize } from "./useHomeSize";

/** LP2 · the main conversion block: the 3-step form beside a short, factual reason to act now. */
export function Lp2Enquire() {
  const ref = useRef<HTMLElement>(null);
  const [size] = useHomeSize();
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} id="enquire" className="sv-section sv-sky" aria-labelledby="enq-title">
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <p className="sv-eyebrow" data-reveal>
            {lp2.formTitle}
          </p>
          <h2 id="enq-title" className="mt-3 text-[30px] leading-[1.1] text-[var(--sv-ink)] sm:text-[44px]" data-reveal>
            See your 5% plan for {size.toLocaleString("en-IN")} sq ft before the offer closes.
          </h2>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-[var(--sv-muted)]" data-reveal>
            Three quick steps. We send the payment schedule, floor plan and cost sheet for your size on WhatsApp, then a SkyVue advisor calls to answer
            your questions.
          </p>
          <ul className="mt-8 grid max-w-xl grid-cols-2 gap-4" data-reveal>
            <li>
              <span className="sv-display sv-tnum block text-[30px] font-light leading-none text-[var(--sv-navy)]">5%</span>
              <span className="mt-1 block text-[13px] text-[var(--sv-muted)]">
                to book, then nothing more till your block&apos;s structure is complete
                <Star />
              </span>
            </li>
            <li>
              <span className="sv-display sv-tnum block text-[30px] font-light leading-none text-[var(--sv-navy)]">570</span>
              <span className="mt-1 block text-[13px] text-[var(--sv-muted)]">exclusive 3 BHK homes only</span>
            </li>
            <li>
              <span className="sv-display sv-tnum block text-[30px] font-light leading-none text-[var(--sv-navy)]">{trackRecord.families}</span>
              <span className="mt-1 block text-[13px] text-[var(--sv-muted)]">families in homes Vaishno delivered</span>
            </li>
            <li>
              <span className="sv-display sv-tnum block text-[30px] font-light leading-none text-[var(--sv-navy)]">31 Dec</span>
              <span className="mt-1 block text-[13px] text-[var(--sv-muted)]">offer on bookings till {skyvue.offer.validTill}</span>
            </li>
          </ul>
        </div>
        <div data-reveal>
          <ScheduleForm formId={`${lp2.id}-steps`} />
        </div>
      </div>
    </section>
  );
}
