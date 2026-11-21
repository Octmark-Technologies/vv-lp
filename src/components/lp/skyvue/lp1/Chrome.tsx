"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skyvue } from "@/data/skyvue-landing";
import { Download, Phone, WhatsApp } from "@/components/Icons";
import { openEnquiry } from "./EnquiryDrawer";
import { withStar } from "../Terms";
import { OfferCountdown } from "../Countdown";
import { useLpMaybe } from "./PageConfig";

const wa = `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent("Hi, I'd like the SkyVue floor plans and cost sheet.")}`;

/** Top bar: appears once the opening scene has played (or immediately without motion). */
export function Header() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const open = document.querySelector<HTMLElement>(".sv-open");
    const motion = document.documentElement.classList.contains("motion");
    if (!open || !motion) return;
    const onScroll = () => {
      const r = open.getBoundingClientRect();
      setShow(r.bottom - innerHeight < r.height * 0.12 || -r.top > (r.height - innerHeight) * 0.78);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.header
          className="sv-head"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 34 }}
        >
          <div className="border-b border-[var(--sv-line)] bg-[rgba(246,244,242,0.86)] backdrop-blur-md">
            <div className="sv-wrap flex h-16 items-center justify-between gap-4">
              <a href="#top" aria-label="Vaishno SkyVue, back to top" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lp/skyvue/brand/skyvue-logo.svg" alt="Vaishno SkyVue" className="h-9 w-auto" />
              </a>
              <p className="hidden shrink-0 items-center gap-2.5 whitespace-nowrap text-[10.5px] uppercase tracking-[0.2em] text-[var(--sv-muted)] xl:flex">
                A project by
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lp/skyvue/brand/vaishno-ventures-logo.svg" alt="Vaishno Ventures" className="h-[22px] w-auto" />
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <OfferCountdown variant="bar" className="max-sm:!hidden" />
                <span className="hidden whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-[var(--sv-muted)] min-[1600px]:inline">
                  TS RERA <strong className="text-[var(--sv-heading)]">{skyvue.rera}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => openEnquiry("header-brochure", "brochure")}
                  className="hidden h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--sv-line)] px-4 text-sm font-semibold text-[var(--sv-heading)] lg:inline-flex"
                >
                  <Download width={16} height={16} /> Brochure
                </button>
                <a
                  href={`tel:${skyvue.phone}`}
                  aria-label={`Call ${skyvue.phoneLabel}`}
                  title={skyvue.phoneLabel}
                  className="hidden h-10 w-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--sv-line)] text-sm font-semibold text-[var(--sv-heading)] md:inline-flex min-[1440px]:w-auto min-[1440px]:px-4"
                >
                  <Phone /> <span className="hidden min-[1440px]:inline">{skyvue.phoneLabel}</span>
                </a>
                <button type="button" onClick={() => openEnquiry("header", "site_visit")} className="sv-btn sv-btn-primary shrink-0 whitespace-nowrap !min-h-10 !px-4 !text-[12px]">
                  <span className="hidden sm:inline">Book my site visit</span>
                  <span className="sm:hidden">Book a visit</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

/** Bottom rail: the key facts stay on screen the whole time; on phones it adds Call · WhatsApp · Enquire. */
export function FactRail() {
  const offer = useLpMaybe()?.offer;
  return (
    <div className="sv-rail border-t border-[var(--sv-line)] bg-[rgba(246,244,242,0.92)] backdrop-blur-md">
      <div className="sv-wrap flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-[11.5px] sv-tnum sm:text-[12.5px] md:flex-nowrap md:justify-between md:py-2.5">
        <ul className="flex min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 sm:gap-x-5 md:flex-nowrap md:justify-start md:whitespace-nowrap">
          <li>
            {offer ? (
              <>
                <strong className="text-[var(--sv-ink)]">{offer.price}</strong> {offer.priceNote}
              </>
            ) : (
              <>
                Starting from <strong className="text-[var(--sv-ink)]">{skyvue.priceFrom}</strong>
              </>
            )}
          </li>
          <li>
            <strong className="text-[var(--sv-ink)]">Exclusive 3 BHK</strong>
            <span className="hidden sm:inline"> · {skyvue.sizeRange}</span>
          </li>
          <li className="hidden xl:list-item">{offer ? <strong className="text-[var(--sv-ink)]">{offer.rail}</strong> : withStar(skyvue.offer.short)}</li>
          <li className="hidden text-[var(--sv-muted)] md:list-item xl:hidden">TS RERA {skyvue.rera}</li>
        </ul>
        <button type="button" onClick={() => openEnquiry("rail")} className="sv-btn sv-btn-primary hidden shrink-0 !min-h-9 !px-4 !text-[12px] md:inline-flex">
          {offer ? "Get my quote" : "Get my floor plans"}
        </button>
      </div>
      <nav aria-label="Quick contact" className="grid grid-cols-3 text-[13px] font-semibold md:hidden">
        <a href={`tel:${skyvue.phone}`} className="flex items-center justify-center gap-2 py-3 text-[var(--sv-heading)]">
          <Phone /> Call
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] py-3 text-white">
          <WhatsApp width={18} height={18} /> WhatsApp
        </a>
        <button type="button" onClick={() => openEnquiry("bottom-bar")} className="flex items-center justify-center bg-[var(--sv-orange)] py-3 text-[var(--sv-on-orange)]">
          Enquire
        </button>
      </nav>
    </div>
  );
}

/** Pillar-of-Trust progress bar: navy fills orange as the page is read. */
export function ProgressPillar() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".sv-progress");
    if (!el) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      el.style.setProperty("--p", `${max > 0 ? (scrollY / max) * 100 : 0}%`);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="sv-progress" aria-hidden="true">
      <i />
    </div>
  );
}

export function DesktopWhatsApp() {
  return (
    <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-[76px] right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg md:grid">
      <WhatsApp />
    </a>
  );
}
