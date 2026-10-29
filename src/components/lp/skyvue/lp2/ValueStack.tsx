"use client";

import { useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import { valueStack } from "@/data/skyvue-lp2";
import { revealOnEnter, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { withStar } from "../Terms";

/**
 * LP2 · "Why 5% is enough" — the offer through Hormozi's value equation, as the buyer feels it:
 * what you get (dream outcome), why you can trust it (likelihood), what it takes today (effort),
 * how long you wait (time). Confirmed facts only. A thin orange line draws across the four as
 * the section arrives, then the CTA repeats.
 */
export function ValueStack() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, (root) => {
    revealOnEnter(root);
    animate(root.querySelectorAll<HTMLElement>("[data-vs-line]"), {
      scaleX: [0, 1],
      duration: 1100,
      delay: stagger(140),
      ease: "outExpo",
      autoplay: onScroll({ target: root.querySelector<HTMLElement>("[data-vs]")!, enter: { target: "top", container: "bottom-=120" }, repeat: false }),
    });
  });
  return (
    <section ref={ref} className="sv-section bg-white" aria-labelledby="vs-title" id="why-5">
      <div className="sv-wrap" data-reveal-group>
        <div className="max-w-3xl">
          <p className="sv-eyebrow" data-reveal>
            Why 5% is enough
          </p>
          <h2 id="vs-title" className="mt-3 text-[30px] leading-[1.1] text-[var(--sv-ink)] sm:text-[44px]" data-reveal>
            A luxury home, a builder you can check, and a small first step.
          </h2>
        </div>
        <dl data-vs className="sv-vs mt-12">
          {valueStack.map((v) => (
            <div key={v.k} data-reveal>
              <span data-vs-line className="sv-vs-line" aria-hidden="true" />
              <dt className="text-[13px] font-semibold text-[var(--sv-muted)]">{v.k}</dt>
              <dd className="sv-display mt-2 text-[24px] font-light leading-tight text-[var(--sv-navy)] sm:text-[28px]">{withStar(v.v)}</dd>
              <dd className="mt-2 text-[15px] leading-relaxed text-[var(--sv-muted)]">{withStar(v.d)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex flex-wrap items-center gap-4" data-reveal>
          <button type="button" onClick={() => openEnquiry("value-stack", "payment_schedule")} className="sv-btn sv-btn-primary">
            Get my 5% payment schedule
          </button>
          <a href="#terms" className="text-[13px] text-[var(--sv-muted)] underline underline-offset-2">
            *Conditions apply
          </a>
        </div>
      </div>
    </section>
  );
}
