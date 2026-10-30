"use client";

import { Suspense, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { HeroCopy, HeroText } from "../HeroCopy";
import { skyvue, trackRecord } from "@/data/skyvue-landing";
import { pinnedScroll, useAnime } from "./anim";
import { useLp } from "./PageConfig";
import { openEnquiry } from "./EnquiryDrawer";
import { WhatsApp } from "@/components/Icons";
import { OfferCountdown } from "../Countdown";

const ORANGE_D =
  "M 297.277344 314.863281 L 297.277344 409.339844 C 306.117188 401.191406 317.441406 391.105469 326.417969 383.097656 C 334.019531 376.605469 333.601562 371.21875 333.601562 360.03125 L 333.601562 314.863281 Z";
const NAVY_D =
  "M 316.339844 486.546875 L 316.339844 392.074219 C 307.359375 400.222656 296.171875 410.304688 287.195312 418.316406 C 279.597656 424.808594 279.875 430.195312 279.875 441.382812 L 279.875 486.546875 Z";
const PILLAR_W = 54.2;

/**
 * Scene 1 · Opening. The Pillar of Trust grows until its halves fill the screen, splits
 * along its diagonal (orange up-right, navy down-left) and the SkyVue towers stand in
 * the gap; then the page's hook and the key facts settle in. Scroll-synced with anime.js.
 * Without motion the section renders its final frame: towers, hook, facts, CTAs.
 */
export function Opening() {
  const ref = useRef<HTMLElement>(null);
  const lp = useLp();

  useAnime(ref, (root) => {
    const pillar = root.querySelector<HTMLElement>("[data-open-pillar]")!;
    const pw = pillar.offsetWidth;
    const ph = pillar.offsetHeight;
    const cover = Math.max((innerWidth * 1.25) / pw, (innerHeight * 2.4) / ph);
    const unit = (pw / PILLAR_W) * cover; // screen px per SVG unit at full size
    const dx = (innerWidth * 0.95) / unit;
    const dy = (innerHeight * 1.15) / unit;

    // The towers start hidden behind the "I" (centred on the pillar) and travel to their resting place
    // (the right side on desktop, bottom centre on phones) as the pillar splits.
    const towers = root.querySelector<HTMLElement>("[data-open-towers]")!;
    const saved = towers.style.transform;
    towers.style.transform = "none";
    const tr = towers.getBoundingClientRect();
    towers.style.transform = saved;
    const pr = pillar.getBoundingClientRect();
    const stageTop = root.querySelector<HTMLElement>(".sv-stage")!.getBoundingClientRect().top;
    const fromX = pr.left + pr.width / 2 - (tr.left + tr.width / 2);
    const fromY = (pr.top - stageTop + pr.height / 2 - (tr.top - stageTop + tr.height / 2)) * 0.45;

    const tl = createTimeline({ autoplay: pinnedScroll(root), defaults: { ease: "inOutQuad" } });
    tl
      .add("[data-open-intro]", { opacity: [1, 0], translateY: [0, -40], duration: 160, ease: "linear" }, 30)
      .add(pillar, { scale: [1, cover], duration: 300, ease: "inQuad" }, 0)
      .add("[data-open-towers]", { opacity: [0, 1], duration: 60, ease: "linear" }, 240)
      .add("[data-open-orange]", { translateX: [0, dx], translateY: [0, -dy], duration: 380, ease: "inOutCubic" }, 300)
      .add("[data-open-navy]", { translateX: [0, -dx], translateY: [0, dy], duration: 380, ease: "inOutCubic" }, 300)
      .add(towers, { translateX: [fromX, 0], translateY: [fromY, 0], scale: [0.72, 1], duration: 440, ease: "inOutCubic" }, 300)
      .add(pillar, { opacity: [1, 0], duration: 40, ease: "linear" }, 660)
      .add(root.querySelector<HTMLElement>(".sv-stage")!, { "--copy-veil": [0, 1], duration: 160, ease: "linear" }, 680)
      .add("[data-open-end]", { opacity: [0, 1], translateY: [26, 0], duration: 220, delay: stagger(45), ease: "outCubic" }, 700)
      .add({ duration: 60 }, 1000);

    // The size line's numbers count up with the scroll as the hook settles (2,010 · 2,890).
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const to = Number(el.dataset.count);
      const box = { v: 0 };
      tl.add(box, { v: [0, to], duration: 220, ease: "outCubic", onUpdate: () => (el.textContent = Math.round(box.v).toLocaleString("en-IN")) }, 760);
    });
  }, [lp.id]);

  const v = lp.hero[lp.defaultVersion];
  return (
    <section ref={ref} className="sv-pin sv-open sv-sky" style={{ ["--pin" as string]: "200svh" }} aria-label="Vaishno SkyVue">
      <div className="sv-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-open-towers
          className="sv-open-towers"
          src="/lp/skyvue/scroll/towers-closeup-alpha-2400.webp"
          srcSet="/lp/skyvue/scroll/towers-closeup-alpha-1200.webp 1200w, /lp/skyvue/scroll/towers-closeup-alpha-2400.webp 2400w"
          sizes="(max-width: 899px) 100vw, 60vw"
          alt="Vaishno SkyVue towers in Tellapur"
          fetchPriority="high"
        />

        <div className="sv-open-pillar" data-open-pillar aria-hidden="true">
          <svg viewBox="279.6 314.86 54.2 171.7">
            <path data-open-navy fill="var(--sv-navy)" d={NAVY_D} />
            <path data-open-orange fill="var(--sv-orange)" d={ORANGE_D} />
          </svg>
        </div>

        {/* "PILLAR OF TRUST", lifted as vector from the brand logo presentation (Circular Std Book, #272726) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-open-intro className="sv-open-pot" src="/lp/skyvue/brand/pillar-of-trust-wordmark.svg" alt="" aria-hidden="true" />

        <div className="sv-open-intro" data-open-intro aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lp/skyvue/brand/skyvue-logo.svg" alt="" className="mx-auto h-[clamp(44px,min(6.5vw,8svh),80px)] w-auto" />
          <p className="mt-3 text-[12px] uppercase tracking-[0.3em] text-[var(--sv-muted)]">Chaos to Calm</p>
          <p className="mt-5 inline-flex items-center gap-2.5 text-[10.5px] uppercase tracking-[0.22em] text-[var(--sv-muted)]">
            A project by
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lp/skyvue/brand/vaishno-ventures-logo.svg" alt="" className="h-[22px] w-auto" />
          </p>
          <div className="mt-7">
            <OfferCountdown variant="hero" tone="light" />
          </div>
        </div>

        <div className="sv-wrap">
          <div className="sv-open-copy">
            <div data-open-end>
              <Suspense fallback={<HeroText copy={v} tone="light" />}>
                <HeroCopy copies={lp.hero} fallback={lp.defaultVersion} tone="light" />
              </Suspense>
            </div>
            <ul data-open-end className="mt-7 flex flex-wrap gap-2 text-[13px] sv-tnum">
              {["Exclusive 3 BHK", skyvue.sizeRange, skyvue.priceLine].map((t) => (
                <li key={t} className="rounded-full border border-[var(--sv-line)] bg-white/70 px-3.5 py-1.5 backdrop-blur">
                  {t}
                </li>
              ))}
            </ul>
            <div data-open-end className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => openEnquiry("hero", lp.intent === "site_visit" ? "site_visit" : "enquiry")} className="sv-btn sv-btn-primary">
                {lp.heroCta ?? "Get floor plans & cost sheet"}
              </button>
              <a
                href={`https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent("Hi, I'd like the SkyVue floor plans and cost sheet.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-btn sv-btn-wa"
              >
                <WhatsApp width={18} height={18} /> WhatsApp
              </a>
            </div>
            <ul data-open-end className="sv-trust mt-6" aria-label="Why buyers trust SkyVue">
              <li>
                <strong>TS RERA</strong> {skyvue.rera}
              </li>
              <li>
                <strong>{trackRecord.projects}</strong> projects
              </li>
              <li>
                <strong>{trackRecord.families}</strong> families in delivered homes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
