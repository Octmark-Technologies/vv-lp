"use client";

import { useEffect, useState } from "react";
import { skyvue } from "@/data/skyvue-landing";
import { lpPaths } from "@/data/lp-paths";
import { Check, Phone, WhatsApp } from "@/components/Icons";
import { FooterCredit } from "./FooterCredit";
import "./lp1/lp1.css";

/**
 * /thank-you/ — where every SkyVue lead form lands after a successful submit.
 * A real page, so Google Ads / Meta / GA4 can count it as the lead conversion (page view), next to
 * the skyvue_lead dataLayer event. The visitor's first name, intent and the page they came from are
 * read from sessionStorage (set by sendLead); nothing personal goes in the URL.
 */
type Ty = { first?: string; intent?: "enquiry" | "site_visit" | "payment_schedule"; back?: string; size?: string | null };

const copy = {
  enquiry: {
    sub: "A SkyVue advisor will call you shortly with the floor plans for your size, the cost sheet and the RERA details.",
    wa: "Hi, I just filled the SkyVue form. Please send the floor plans, cost sheet and RERA details.",
  },
  payment_schedule: {
    sub: "A SkyVue advisor will call you shortly with your 5% payment schedule, the floor plan and the cost sheet for your size.",
    wa: "Hi, I just filled the SkyVue form. Please send my 5% payment schedule and cost sheet.",
  },
  site_visit: {
    sub: "A SkyVue advisor will call you shortly to fix your site-visit slot, on a weekday or a weekend.",
    wa: "Hi, I just booked a SkyVue site visit. Please confirm my slot.",
  },
} as const;

export function ThankYou() {
  const [ty, setTy] = useState<Ty>({});
  useEffect(() => {
    try {
      setTy(JSON.parse(sessionStorage.getItem("sv_ty") ?? "{}"));
    } catch {}
  }, []);
  const c = copy[ty.intent ?? "enquiry"] ?? copy.enquiry;
  const back = ty.back && ty.back.startsWith("/") ? ty.back : lpPaths.lp1;
  const backPath = back.split("?")[0];
  const backHref = `${back}${back.includes("#") ? "" : "#homes"}`;
  const wa = `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent(c.wa)}`;
  const steps = [
    { t: "We call you", d: `From ${skyvue.phoneLabel}. Save the number so you know it's us.` },
    { t: "You get the details", d: "Floor plans, cost sheet and RERA certificate, on WhatsApp." },
    { t: "You visit the site", d: "Pick a weekday or weekend slot. Bring the family." },
  ];

  return (
    <div className="sv1 sv-sky flex min-h-svh flex-col">
      <header className="sv-wrap flex items-center justify-between py-5">
        <a href={backPath} aria-label="Back to Vaishno SkyVue">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lp/skyvue/brand/skyvue-logo.svg" alt="Vaishno SkyVue" className="h-10 w-auto" />
        </a>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lp/skyvue/brand/vaishno-ventures-logo.svg" alt="Vaishno Ventures" className="hidden h-6 w-auto sm:block" />
      </header>

      <main className="sv-wrap flex-1 pb-16 pt-6 sm:pt-12">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-[0_30px_80px_-30px_rgba(20,45,71,0.45)] sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--sv-orange)] text-[#1a1a19]">
            <Check width={26} height={26} />
          </span>
          <p className="sv-eyebrow mt-6">Vaishno SkyVue · Tellapur</p>
          <h1 className="mt-2 text-[32px] leading-[1.1] text-[var(--sv-heading)] sm:text-[44px]">
            Thank you{ty.first ? `, ${ty.first}` : ""}. Your details are in.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--sv-muted)] sm:text-[17px]">{c.sub}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-wa">
              <WhatsApp width={18} height={18} /> Get it on WhatsApp now
            </a>
            <a href={`tel:${skyvue.phone}`} className="sv-btn sv-btn-ghost text-[var(--sv-heading)]">
              <Phone width={16} height={16} /> Call {skyvue.phoneLabel}
            </a>
          </div>

          <h2 className="mt-10 text-[22px] text-[var(--sv-heading)] sm:text-[26px]">What happens next</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-2xl bg-[var(--sv-mist)] p-4">
                <span className="sv-tnum grid h-8 w-8 place-items-center rounded-full bg-[var(--sv-navy)] text-[13px] font-semibold text-white">{i + 1}</span>
                <p className="mt-3 font-semibold text-[var(--sv-heading)]">{s.t}</p>
                <p className="mt-1 text-[14px] leading-snug text-[var(--sv-muted)]">{s.d}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--sv-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a href={backHref} className="sv-btn sv-btn-primary">
              See my floor plans
            </a>
            <p className="text-[12px] text-[var(--sv-muted)]">TS RERA {skyvue.rera} · Starting from {skyvue.priceFrom}</p>
          </div>
        </div>
      </main>

      <footer className="bg-[#142d47] pb-10 pt-6 text-white/60">
        <div className="sv-wrap">
          <FooterCredit />
        </div>
      </footer>
    </div>
  );
}
