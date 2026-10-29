"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatLakh, skyvue } from "@/data/skyvue-landing";
import { payStatus, paySteps } from "@/data/skyvue-lp2";
import { withStar } from "../Terms";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { useHomeSize } from "./useHomeSize";


/**
 * LP2 signature scene, the side beside the rising tower: "Your money moves with the building."
 * The meter stays at 5% while the floors climb 0 → 36 (hands-free), then the steps move on to
 * no-cost EMI and possession. Amounts follow the size picked in the calculator.
 */
export function PayAside({ floors, phase }: { floors: number; phase: number }) {
  const [size] = useHomeSize();
  const booking = size * skyvue.basePrice * 0.05;
  const stepOn = phase === 0 ? 1 : phase === 1 ? 2 : 3;
  const s = payStatus[phase];
  return (
    <div>
      <p className="sv-eyebrow">How the 5% plan works</p>
      <h2 id="build-title" className="mt-3 text-[28px] leading-tight text-[var(--sv-ink)] sm:text-[40px]">
        Your money moves with the building.
      </h2>

      <div className="sv-pay-meter mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[13px] font-semibold text-[var(--sv-muted)]">Paid so far</p>
          <p className="sv-tnum text-[13px] text-[var(--sv-muted)]">
            {size.toLocaleString("en-IN")} sq ft home
          </p>
        </div>
        <p className="mt-1 flex items-baseline gap-3">
          <span className="sv-display sv-tnum text-[52px] font-light leading-none text-[var(--sv-orange)]">5%</span>
          <span className="sv-tnum text-[17px] text-[var(--sv-ink)]">≈ {formatLakh(booking)}</span>
        </p>
        <div className="sv-pay-bar mt-4" aria-hidden="true">
          <span style={{ transform: `scaleX(${floors / 36})` }} />
        </div>
        <p className="sv-tnum mt-2 text-[13px] text-[var(--sv-muted)]">
          <strong className="text-[var(--sv-navy)]">{floors}</strong> of 36 storeys rise. You stay at 5%.
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            className="mt-4 text-[15px] leading-snug text-[var(--sv-ink)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
          >
            <strong className="text-[var(--sv-orange)]">{s.k}.</strong> {withStar(s.t)}
          </motion.p>
        </AnimatePresence>
      </div>

      <ol className="sv-pay-steps mt-6">
        {paySteps.map((st, i) => (
          <li key={st.t} className={i < stepOn ? "is-done" : i === stepOn ? "is-on" : ""}>
            <span className="block font-semibold text-[var(--sv-ink)]">{withStar(st.t)}</span>
            <span className="text-[13px] text-[var(--sv-muted)]">{withStar(st.d)}</span>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => openEnquiry("pay-scene", "payment_schedule")} className="sv-btn sv-btn-primary mt-6">
        Get my payment schedule
      </button>
      <p className="mt-3 text-[12px] text-[var(--sv-muted)]">
        <a href="#terms" className="underline underline-offset-2">
          *Conditions apply
        </a>
      </p>
    </div>
  );
}
