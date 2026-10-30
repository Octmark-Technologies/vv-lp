"use client";

import { Suspense, useRef } from "react";
import { animate, onScroll } from "animejs";
import { projects } from "@/data/projects";
import { skyvue } from "@/data/skyvue-landing";
import { lp4 } from "@/data/skyvue-lp4";
import { HeroCopy, HeroText } from "../HeroCopy";
import { OfferCountdown } from "../Countdown";
import { pinnedScroll, seg, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { ScrollFrames } from "../ScrollFrames";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/* ───────────────────────── 1 · The site, live (hero) ─────────────────────────
 * Real drone footage of the SkyVue site (27 Oct 2026), scrubbed by the scroll: the camera pushes
 * in over Block A, Block B and the clubhouse. The headline is on screen from the first frame. */
export function SiteLive() {
  const v = lp4.hero[lp4.defaultVersion];
  return (
    <section aria-label="The SkyVue site, filmed 27 Oct 2026" className="sv-live">
      <ScrollFrames
        shot="site-live"
        frames={83}
        mobileFrames={41}
        heightClass="[html.motion_&]:h-[170vh] md:[html.motion_&]:h-[210vh]"
        alt="Drone view of the SkyVue construction site in Tellapur with Block A, Block B and the clubhouse marked, October 2026"
        focusX={0.55}
        eager
      >
        <div className="sv-live-badge" aria-hidden="true">
          <span className="sv-live-dot" /> Site footage · 27 Oct 2026
        </div>
        <div className="sv-live-copy">
          <div className="sv-wrap">
            <div className="sv-live-inner">
              <Suspense fallback={<HeroText copy={v} tone="dark" />}>
                <HeroCopy copies={lp4.hero} fallback={lp4.defaultVersion} tone="dark" />
              </Suspense>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => openEnquiry("hero", "site_visit")} className="sv-btn sv-btn-primary">
                  {lp4.heroCta}
                </button>
                <a href="#progress" className="sv-btn sv-btn-ghost text-white">
                  Watch the monthly updates
                </a>
              </div>
              <OfferCountdown variant="hero" tone="dark" className="sv-cd-start mt-6" />
              <ul className="sv-live-proof" aria-label="Proof you can check">
                <li>
                  <strong className="sv-tnum">{skyvue.rera}</strong> TS RERA
                </li>
                <li>
                  <strong className="sv-tnum">943</strong> homes delivered
                </li>
                <li>
                  <strong className="sv-tnum">9</strong> projects in Bangalore
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollFrames>
    </section>
  );
}

/* ───────────────────────── 2 · The proof ledger ─────────────────────────
 * Vaishno Ventures' Bangalore projects enter one by one, oldest-looking list order from
 * vaishnoventures.com, while the "homes handed over" total counts up to 943. It closes on SkyVue.
 * Desktop: held on screen. Phones: each row lands as it scrolls in. Reduced motion: complete list. */
const delivered = projects.filter((p) => p.city === "Bengaluru" && p.status === "completed");
const ongoing = projects.filter((p) => p.city === "Bengaluru" && p.status === "ongoing");
const total = delivered.reduce((s, p) => s + p.units, 0);

export function Ledger() {
  const ref = useRef<HTMLElement>(null);

  useAnime(ref, (root) => {
    const rows = [...root.querySelectorAll<HTMLElement>("[data-row]")];
    const count = root.querySelector<HTMLElement>("[data-total]");
    const bar = root.querySelector<HTMLElement>("[data-bar]");
    const close = root.querySelector<HTMLElement>("[data-close]");
    const sums = rows.map((_, i) => delivered.slice(0, i + 1).reduce((s, p) => s + p.units, 0));
    const show = (el: HTMLElement, k: number) => {
      el.style.opacity = k.toFixed(3);
      el.style.transform = `translate3d(${((1 - ease(k)) * 28).toFixed(1)}px, 0, 0)`;
    };
    const setTotal = (n: number) => {
      if (count) count.textContent = Math.round(n).toLocaleString("en-IN");
      if (bar) bar.style.transform = `scaleX(${(n / total).toFixed(4)})`;
    };
    const pinned = matchMedia("(min-width: 1000px) and (min-height: 640px)").matches;
    if (pinned) {
      root.classList.add("is-pinned");
      const update = (p: number) => {
        const k = seg(p, 0.04, 0.78);
        let n = 0;
        rows.forEach((el, i) => {
          const a = i / rows.length;
          const r = seg(k, a, a + 1 / rows.length);
          show(el, r);
          n += delivered[i].units * ease(r);
        });
        setTotal(n);
        if (close) show(close, seg(p, 0.8, 0.95));
      };
      update(0);
      pinnedScroll(root, update);
    } else {
      setTotal(0);
      rows.forEach((el, i) => {
        show(el, 0);
        const st = { t: 0 };
        animate(
          st,
          {
            t: [0, 1],
            duration: 650,
            ease: "outCubic",
            onUpdate: () => show(el, st.t),
            onComplete: () => setTotal(Math.max(Number(count?.textContent?.replace(/,/g, "") || 0), sums[i])),
            autoplay: onScroll({ target: el, enter: "bottom-=8% top", repeat: false }),
          },
        );
      });
      if (close) show(close, 1);
    }
  });

  return (
    <section ref={ref} className="sv-pin sv-ledger" style={{ ["--pin" as string]: "230svh" }} aria-labelledby="ledger-title" id="track-record">
      <div className="sv-stage sv-ledger-stage">
        <div className="sv-wrap sv-ledger-grid">
          <div className="min-w-0">
            <p className="sv-eyebrow">The track record · vaishnoventures.com</p>
            <h2 id="ledger-title" className="mt-3 text-[30px] leading-[1.08] text-white sm:text-[46px]">
              Every home we promised in Bangalore, handed over.
            </h2>
            <div className="sv-ledger-total">
              <p className="sv-display sv-tnum">
                <span data-total>{total.toLocaleString("en-IN")}</span>
              </p>
              <p className="text-[14px] text-white/70">homes handed over across {delivered.length} projects in East Bangalore</p>
              <span className="sv-ledger-bar" aria-hidden="true">
                <span data-bar />
              </span>
            </div>
            <div className="sv-ledger-close" data-close>
              <p className="text-[13px] uppercase tracking-[0.18em] text-white/60">Under construction now</p>
              <p className="mt-2 text-[15px] text-white/85">
                {ongoing.map((p) => p.name.replace("Vaishno ", "")).join(" and ")} in Bangalore, and <strong className="text-white">Vaishno SkyVue</strong> in Tellapur: 570 homes, TS
                RERA {skyvue.rera}.
              </p>
              <button type="button" onClick={() => openEnquiry("ledger", "site_visit")} className="sv-btn sv-btn-primary mt-5">
                Get the project addresses
              </button>
            </div>
          </div>
          <ol className="sv-ledger-list" aria-label="Delivered projects">
            {delivered.map((p, i) => (
              <li key={p.slug} data-row>
                <span className="sv-ledger-n sv-tnum">{String(i + 1).padStart(2, "0")}</span>
                <span className="sv-ledger-name">{p.name.replace("Vaishno ", "")}</span>
                <span className="sv-ledger-loc">{p.locality}</span>
                <span className="sv-ledger-u sv-tnum">{p.units} homes</span>
                <span className="sv-ledger-tag">Delivered</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** The Bangalore drone film, as a plain section (used after the ledger). */
export function BangaloreFilm() {
  return (
    <section className="sv-section bg-[#001b36] text-white" aria-labelledby="blr-title">
      <div className="sv-wrap grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div className="min-w-0">
          <p className="sv-eyebrow">Filmed by drone</p>
          <h2 id="blr-title" className="mt-3 text-[28px] leading-tight sm:text-[40px]">
            See our Bangalore projects from the air.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/70">Homes that families live in today, built by the same team that is building SkyVue.</p>
        </div>
        <video
          className="aspect-video w-full rounded-2xl bg-black object-cover"
          src="/lp/skyvue/vaishno-bangalore-construction-drone.mp4"
          poster="/lp/skyvue/vaishno-bangalore-construction-drone-poster.jpg"
          controls
          muted
          playsInline
          preload="none"
        />
      </div>
    </section>
  );
}
