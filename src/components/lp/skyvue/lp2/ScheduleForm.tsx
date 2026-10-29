"use client";

import { privacyUrl } from "@/data/lp-paths";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatLakh, formOptions, skyvue, units } from "@/data/skyvue-landing";
import { lp2, whatYouGet } from "@/data/skyvue-lp2";
import { Check, WhatsApp } from "@/components/Icons";
import { sendLead } from "../LeadForm";
import { useHomeSize } from "./useHomeSize";

type Step = 0 | 1 | 2;

/**
 * LP2 · 3-step form ("progressive disclosure": one small decision per screen).
 * 1 · your home size (pre-set from the calculator) → shows your 5% amount
 * 2 · budget and buying timeline (big tap targets)
 * 3 · name, mobile, consent → the shared sendLead (same API, UTMs, click IDs, dataLayer)
 * Each step pushes a dataLayer event (schedule_form_step) so drop-off can be measured.
 */
export function ScheduleForm({ formId, tone = "light" }: { formId: string; tone?: "light" | "dark" }) {
  const [size, pick] = useHomeSize();
  const [step, setStep] = useState<Step>(0);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const dark = tone === "dark";

  const go = (n: Step) => {
    setError("");
    try {
      sessionStorage.setItem("sv_engaged", "1");
    } catch {}
    setStep(n);
    (window.dataLayer = window.dataLayer || []).push({ event: "schedule_form_step", lp_id: lp2.id, form_id: formId, step: n + 1 });
  };

  async function submit() {
    const p = phone.replace(/\D/g, "").slice(-10);
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(p)) return setError("Please enter a valid 10-digit mobile number.");
    if (!consent) return setError("Please agree to be contacted.");
    setError("");
    setState("sending");
    const ok = await sendLead({ name: name.trim(), phone: p, budget, timeline, intent: "payment_schedule", pageId: lp2.id, pageSlug: lp2.slug, formId, defaultVersion: lp2.defaultVersion });
    if (ok) setState("done");
    else {
      setState("error");
      setError("Something went wrong. Please call or WhatsApp us instead.");
    }
  }

  const wa = `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent(`Hi, please send the SkyVue payment schedule for ${size.toLocaleString("en-IN")} sq ft.`)}`;
  const choice = (on: boolean) => `sv-choice ${on ? "is-on" : ""}`;

  if (state === "done") {
    return (
      <div className={`sv-sform ${dark ? "is-dark" : ""}`} role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--sv-orange)] text-white">
          <Check />
        </span>
        <p className="sv-display mt-5 text-[26px] font-light leading-tight">Thank you, {name.split(" ")[0]}. Your schedule is on its way.</p>
        <p className="mt-2 text-[15px] leading-relaxed opacity-80">
          A SkyVue advisor will call you shortly with the payment schedule for {size.toLocaleString("en-IN")} sq ft. Want it on WhatsApp right now?
        </p>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-wa mt-6">
          <WhatsApp width={18} height={18} /> Get it on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={`sv-sform ${dark ? "is-dark" : ""}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[13px] font-semibold opacity-75">Step {step + 1} of 3</p>
        <div className="sv-sform-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(step + 1) / 3})` }} />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          {step === 0 && (
            <fieldset>
              <legend className="sv-display text-[24px] font-light leading-tight sm:text-[28px]">Which home are you looking at?</legend>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {units.map((u) => (
                  <button key={u.size} type="button" className={choice(u.size === size)} aria-pressed={u.size === size} onClick={() => pick(u.size)}>
                    <span className="sv-tnum block font-semibold">{u.size.toLocaleString("en-IN")} sq ft</span>
                    <span className="sv-tnum block text-[12px] opacity-70">5% ≈ {formatLakh(u.size * skyvue.basePrice * 0.05)}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="sv-btn sv-btn-primary mt-6 w-full" onClick={() => go(1)}>
                Continue
              </button>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="sv-display text-[24px] font-light leading-tight sm:text-[28px]">Your budget and timeline</legend>
              <p className="mt-4 text-[13px] font-semibold opacity-75">Budget</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {formOptions.budget.map((o) => (
                  <button key={o} type="button" className={choice(o === budget)} aria-pressed={o === budget} onClick={() => setBudget(o)}>
                    {o}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[13px] font-semibold opacity-75">Planning to buy</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {formOptions.timeline.map((o) => (
                  <button key={o} type="button" className={choice(o === timeline)} aria-pressed={o === timeline} onClick={() => setTimeline(o)}>
                    {o}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-[auto_1fr] gap-2">
                <button type="button" className="sv-btn sv-btn-ghost" onClick={() => go(0)}>
                  Back
                </button>
                <button
                  type="button"
                  className="sv-btn sv-btn-primary"
                  onClick={() => (budget && timeline ? go(2) : setError("Please choose your budget and timeline."))}
                >
                  Continue
                </button>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <p className="sv-display text-[24px] font-light leading-tight sm:text-[28px]">Where should we send it?</p>
              <div className="mt-5 grid gap-2">
                <label className="sr-only" htmlFor={`${formId}-name`}>
                  Name
                </label>
                <input id={`${formId}-name`} className="sv-field" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <label className="sr-only" htmlFor={`${formId}-phone`}>
                  Mobile number
                </label>
                <div className="flex gap-2">
                  <span className="sv-field grid shrink-0 place-items-center !w-auto px-3">+91</span>
                  <input
                    id={`${formId}-phone`}
                    className="sv-field min-w-0"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="10-digit mobile (WhatsApp)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <label className="mt-1 flex items-start gap-2 text-[12px] leading-snug opacity-75">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#f95300]" />
                  <span>
                    I agree to be contacted by Vaishno Ventures about SkyVue by call, SMS and WhatsApp. See our{" "}
                    <Link href={privacyUrl} className="underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
              </div>
              <div className="mt-5 grid grid-cols-[auto_1fr] gap-2">
                <button type="button" className="sv-btn sv-btn-ghost" onClick={() => go(1)}>
                  Back
                </button>
                <button type="submit" disabled={state === "sending"} className="sv-btn sv-btn-primary disabled:opacity-60">
                  {state === "sending" ? "Sending…" : lp2.formCta}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="mt-3 text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      )}
      <ul className="mt-6 grid gap-1.5 text-[13px] opacity-80">
        {whatYouGet.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check width={14} height={14} className="shrink-0 text-[var(--sv-orange)]" /> {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] opacity-60">TS RERA {skyvue.rera} · No spam, ever.</p>
    </div>
  );
}
