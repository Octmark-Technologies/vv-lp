"use client";

import { privacyUrl } from "@/data/lp-paths";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { formOptions, skyvue } from "@/data/skyvue-landing";
import { Check, WhatsApp } from "@/components/Icons";

const TRACK_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "gbraid", "wbraid"] as const;
const FIRST_TOUCH = "sv_first_touch";
export const UNLOCK_KEY = "sv_unlocked";
export const UNLOCK_EVENT = "sv:unlocked";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function readParams() {
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  TRACK_KEYS.forEach((k) => {
    const v = sp.get(k);
    if (v) out[k] = v;
  });
  return { sp, out };
}

/**
 * Sends one SkyVue lead (shared by LeadForm and LP2's step form): page id, message version,
 * UTMs, click IDs, first touch, landing URL, referrer and the home size picked (sv_size) →
 * /api/enquiry/. On success it opens gated content (UNLOCK_KEY) and pushes skyvue_lead.
 */
export async function sendLead(f: {
  name: string;
  phone: string;
  budget: string;
  timeline: string;
  intent: "enquiry" | "site_visit" | "payment_schedule";
  pageId: string;
  pageSlug: string;
  formId: string;
  /** The page's default message version, reported when the URL has no ?v. */
  defaultVersion?: string;
}): Promise<boolean> {
  const { sp, out } = readParams();
  let firstTouch: unknown = null;
  try {
    firstTouch = JSON.parse(sessionStorage.getItem(FIRST_TOUCH) ?? "null");
  } catch {}
  let homeSize: string | null = null;
  try {
    homeSize = sessionStorage.getItem("sv_size");
  } catch {}
  const lead = {
    name: f.name,
    phone: f.phone,
    budget: f.budget,
    timeline: f.timeline,
    consent: true,
    project: skyvue.name,
    source: "landing-page",
    intent: f.intent,
    lp_id: f.pageId,
    lp_slug: f.pageSlug,
    lp_version: sp.get("v") ?? f.defaultVersion ?? "default",
    form_id: f.formId,
    ...out,
    first_touch: firstTouch,
    landing_url: window.location.href,
    referrer: document.referrer || null,
    home_size: homeSize,
    otpVerified: false,
  };
  try {
    const res = await fetch("/api/enquiry/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!res.ok) return false;
  } catch {
    return false;
  }
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(UNLOCK_EVENT));
  (window.dataLayer = window.dataLayer || []).push({
    event: "skyvue_lead",
    lp_id: f.pageId,
    lp_version: lead.lp_version,
    lead_intent: f.intent,
    lead_home_size: homeSize,
    lead_budget: f.budget,
    lead_timeline: f.timeline,
    form_id: f.formId,
  });
  return true;
}

/**
 * SkyVue lead form — 4 fields (name, mobile, budget, timeline) + consent.
 * Hidden context sent with every lead: landing page id, message version,
 * UTMs, click IDs (GCLID / FBCLID / GBRAID / WBRAID), first-touch source,
 * landing URL and referrer → /api/enquiry/ → CRM_WEBHOOK_URL.
 *
 * TODO(Octmark): plug the OTP provider in here (send on submit, verify, then
 * post with otpVerified: true). The API accepts the flag already.
 */
export function LeadForm({
  pageId,
  pageSlug,
  formId,
  title,
  cta,
  intent = "enquiry",
  tone = "light",
}: {
  pageId: string;
  pageSlug: string;
  formId: string;
  title: string;
  cta: string;
  intent?: "enquiry" | "site_visit" | "payment_schedule";
  tone?: "light" | "dark";
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  // Keep the first-touch source for the session (survives internal navigation).
  useEffect(() => {
    try {
      const { out } = readParams();
      if (Object.keys(out).length && !sessionStorage.getItem(FIRST_TOUCH)) {
        sessionStorage.setItem(FIRST_TOUCH, JSON.stringify({ ...out, at: new Date().toISOString() }));
      }
    } catch {}
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const phone = String(fd.phone ?? "").replace(/\D/g, "").slice(-10);
    if (!fd.name?.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (!fd.budget || !fd.timeline) return setError("Please choose your budget and timeline.");
    if (!fd.consent) return setError("Please agree to be contacted.");
    setError("");
    setState("sending");

    const ok = await sendLead({ name: fd.name.trim(), phone, budget: fd.budget, timeline: fd.timeline, intent, pageId, pageSlug, formId });
    if (ok) setState("done");
    else {
      setState("error");
      setError("Something went wrong. Please call or WhatsApp us instead.");
    }
  }

  const dark = tone === "dark";
  const field = `w-full rounded-lg border px-4 py-3 text-[15px] outline-none transition focus:ring-2 ${
    dark
      ? "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-sv-orange focus:ring-sv-orange/30"
      : "border-sv-navy/15 bg-white text-sv-navy placeholder:text-sv-navy/40 focus:border-sv-orange focus:ring-sv-orange/20"
  }`;
  const wa = `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent(
    "Hi, I'd like the SkyVue brochure, floor plans and cost sheet.",
  )}`;

  if (state === "done") {
    return (
      <div className={`rounded-2xl p-7 ${dark ? "bg-white/10 text-white" : "bg-white text-sv-navy shadow-xl"}`} role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-sv-orange text-white">
          <Check />
        </span>
        <p className="mt-5 text-2xl font-light">Thank you. We&apos;ve got your details.</p>
        <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/70" : "text-sv-navy/70"}`}>
          A SkyVue advisor will call you shortly. The floor plans on this page are now unlocked. Want everything
          on WhatsApp right away?
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
        >
          <WhatsApp width={20} height={20} /> Get it on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      noValidate
      className={`rounded-2xl p-6 sm:p-7 ${dark ? "bg-white/10 text-white backdrop-blur" : "bg-white text-sv-navy shadow-[0_30px_80px_-30px_rgba(0,46,88,0.45)]"}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sv-orange">Vaishno SkyVue · Tellapur</p>
      <h2 className="mt-2 font-sans text-2xl font-light leading-snug">{title}</h2>
      <div className="mt-5 grid gap-3">
        <label className="sr-only" htmlFor={`${formId}-name`}>Name</label>
        <input id={`${formId}-name`} name="name" autoComplete="name" placeholder="Your name" className={field} required />
        <label className="sr-only" htmlFor={`${formId}-phone`}>Mobile number</label>
        <div className="flex gap-2">
          <span className={`grid shrink-0 select-none place-items-center rounded-lg border px-3 text-[15px] ${dark ? "border-white/20 bg-white/10 text-white" : "border-sv-navy/15 bg-sv-mist text-sv-navy"}`}>+91</span>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="10-digit mobile"
            className={`${field} min-w-0`}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="sr-only" htmlFor={`${formId}-budget`}>Budget</label>
          <select id={`${formId}-budget`} name="budget" defaultValue="" className={field} required>
            <option value="" disabled>
              Budget
            </option>
            {formOptions.budget.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`${formId}-timeline`}>Buying timeline</label>
          <select id={`${formId}-timeline`} name="timeline" defaultValue="" className={field} required>
            <option value="" disabled>
              Buying in
            </option>
            {formOptions.timeline.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <label className={`flex items-start gap-2 text-[12px] leading-snug ${dark ? "text-white/70" : "text-sv-navy/60"}`}>
          <input type="checkbox" name="consent" className="mt-0.5 accent-[#f95300]" />
          <span>
            I agree to be contacted by Vaishno Ventures about SkyVue by call, SMS and WhatsApp. See our{" "}
            <Link href={privacyUrl} className="underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 w-full rounded-full bg-sv-orange px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : cta}
      </button>
      <p className={`mt-3 text-center text-[11px] ${dark ? "text-white/50" : "text-sv-navy/50"}`}>
        TS RERA {skyvue.rera} · No spam, ever.
      </p>
    </form>
  );
}
