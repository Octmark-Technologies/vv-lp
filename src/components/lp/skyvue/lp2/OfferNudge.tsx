"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skyvue } from "@/data/skyvue-landing";
import { lp2 } from "@/data/skyvue-lp2";
import { Close } from "@/components/Icons";
import { UNLOCK_EVENT, UNLOCK_KEY } from "../LeadForm";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { useHomeSize } from "./useHomeSize";

const SEEN = "sv_nudge_seen";
/** Set once the visitor starts any form (ScheduleForm also sets it on its first step). */
export const ENGAGED = "sv_engaged";

/**
 * LP2 · one gentle reminder per session (never for someone who already enquired):
 * desktop on exit intent (pointer leaves through the top), phones after 60% of the page,
 * or after 75 seconds. Dismissible; Esc closes it. Not a modal: the page stays usable.
 */
export function OfferNudge() {
  const [show, setShow] = useState(false);
  const [size] = useHomeSize();

  useEffect(() => {
    const allowed = () => {
      try {
        return !sessionStorage.getItem(SEEN) && !sessionStorage.getItem(ENGAGED) && localStorage.getItem(UNLOCK_KEY) !== "1";
      } catch {
        return false;
      }
    };
    if (!allowed()) return;
    let done = false;
    // Never interrupt someone already filling a form, or while the form section is on screen.
    const busy = () => {
      const enq = document.querySelector("#enquire")?.getBoundingClientRect();
      const formOnScreen = !!enq && enq.top < innerHeight && enq.bottom > 0;
      const drawerOpen = !!document.querySelector('[role="dialog"]');
      return formOnScreen || drawerOpen;
    };
    const open = (why: string) => {
      if (done || !allowed() || busy()) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
      setShow(true);
      (window.dataLayer = window.dataLayer || []).push({ event: "offer_nudge_shown", lp_id: lp2.id, trigger: why });
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) open("exit_intent");
    };
    const onScroll = () => {
      if (busy()) setShow(false); // step aside as soon as the form section arrives
      const max = document.documentElement.scrollHeight - innerHeight;
      if (innerWidth < 900 && max > 0 && scrollY / max > 0.6) open("scroll_60");
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShow(false);
    const onEngage = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.closest?.("form, .sv-sform")) {
        try {
          sessionStorage.setItem(ENGAGED, "1");
        } catch {}
        setShow(false);
      }
    };
    const onLead = () => setShow(false);
    document.addEventListener("focusin", onEngage);
    addEventListener(UNLOCK_EVENT, onLead);
    const t = setTimeout(() => open("time_75s"), 75_000);
    document.addEventListener("mouseout", onLeave);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", onLeave);
      removeEventListener("scroll", onScroll);
      removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onEngage);
      removeEventListener(UNLOCK_EVENT, onLead);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          className="sv-nudge"
          role="complementary"
          aria-label="Offer reminder"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <button type="button" aria-label="Close" onClick={() => setShow(false)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-[var(--sv-muted)] hover:bg-[var(--sv-mist)]">
            <Close width={16} height={16} />
          </button>
          <p className="text-[12px] font-semibold text-[var(--sv-orange)]">Before you go</p>
          <p className="sv-display mt-1 pr-6 text-[20px] font-light leading-snug text-[var(--sv-ink)]">
            Book your {size.toLocaleString("en-IN")} sq ft home with just 5%.
          </p>
          <p className="mt-1 text-[13px] text-[var(--sv-muted)]">Get the full payment schedule on WhatsApp. Offer on bookings till {skyvue.offer.validTill}.</p>
          <button
            type="button"
            className="sv-btn sv-btn-primary mt-4 w-full"
            onClick={() => {
              setShow(false);
              openEnquiry("nudge", "payment_schedule");
            }}
          >
            Send me the schedule
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
