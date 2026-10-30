"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { onScroll, animate } from "animejs";
import { skyvue, trackRecord } from "@/data/skyvue-landing";
import { altitudeLevels, contrast, lp3 } from "@/data/skyvue-lp3";
import { HeroCopy, HeroText } from "../HeroCopy";
import { OfferCountdown } from "../Countdown";
import { motionOn, pinnedScroll, revealOnEnter, seg, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { Copy } from "../lp1/FrameScenes";
import { ScrollFrames } from "../ScrollFrames";
import { Photo3D, type Photo3DPose } from "./Photo3D";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ───────────────────────── 1 · Altitude (hero) ─────────────────────────
 * The camera tilts up the tower while a line climbs it: street → parking → car-free podium →
 * "70 ft · homes begin" → 36 storeys. The render is only framed and moved, never altered.
 * Desktop (≥1000 × 640): held on screen. Phones: the frame plays as it passes. Reduced motion: final frame. */
export function Altitude() {
  const ref = useRef<HTMLElement>(null);
  const [level, setLevel] = useState(altitudeLevels.length - 1);
  const last = useRef(-1);

  useAnime(ref, (root) => {
    const frame = root.querySelector<HTMLElement>("[data-alt-frame]")!;
    const img = root.querySelector<HTMLElement>("[data-alt-img]")!;
    const line = root.querySelector<HTMLElement>("[data-alt-line]")!;
    const read = root.querySelector<HTMLElement>("[data-alt-read]")!;
    const n = altitudeLevels.length;
    const set = (k: number) => {
      const e = inOut(k);
      // camera: start on the base, finish on the crown (image is 140% of the frame's height)
      img.style.transform = `translate3d(0, ${(-28.57 * (1 - e)).toFixed(2)}%, 0) scale(${(1.04 - 0.04 * e).toFixed(4)})`;
      // the line climbs the tower in frame space: 86% → 14% from the top
      line.style.top = `${(86 - 72 * e).toFixed(2)}%`;
      const lv = Math.min(n - 1, Math.floor(k * n * 0.999));
      if (lv !== last.current) {
        last.current = lv;
        setLevel(lv);
      }
      // storeys count once you are above the podium
      const storeys = Math.max(0, Math.round(seg(k, 0.6, 1) * 36));
      read.textContent = lv < 3 ? altitudeLevels[lv].v : lv === 3 && storeys < 2 ? "70 ft" : `Storey ${Math.max(1, storeys)} of 36`;
    };
    set(0);
    const pinned = matchMedia("(min-width: 1000px) and (min-height: 640px)").matches;
    if (pinned) {
      root.classList.add("is-pinned");
      pinnedScroll(root, (p) => set(seg(p, 0.04, 0.92)));
    } else {
      animate(
        { t: 0 },
        { t: [0, 1], ease: "linear", duration: 1000, autoplay: onScroll({ target: frame, enter: "bottom-=10% top", leave: "top+=10% top", sync: 0.25, onUpdate: (self) => set(self.progress) }) },
      );
    }
  });

  const v = lp3.hero[lp3.defaultVersion];
  const lv = altitudeLevels[level];
  return (
    <section ref={ref} className="sv-pin sv-alt sv-sky" style={{ ["--pin" as string]: "240svh" }} aria-label="Vaishno SkyVue, 70 ft above">
      <div className="sv-stage sv-alt-stage">
        <div className="sv-wrap sv-alt-grid">
          <div className="sv-alt-copy">
            <Suspense fallback={<HeroText copy={v} tone="light" />}>
              <HeroCopy copies={lp3.hero} fallback={lp3.defaultVersion} tone="light" />
            </Suspense>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => openEnquiry("hero")} className="sv-btn sv-btn-primary">
                {lp3.heroCta}
              </button>
              <a href="#view" className="sv-btn sv-btn-ghost text-[var(--sv-navy)]">
                See the view
              </a>
            </div>
            <OfferCountdown variant="hero" tone="light" className="sv-cd-start mt-7" />
            <ul className="sv-trust mt-6" aria-label="Why buyers trust SkyVue">
              <li>
                <strong>TS RERA</strong> {skyvue.rera}
              </li>
              <li>
                <strong>{trackRecord.projects}</strong> projects
              </li>
              <li>
                Starting from <strong>{skyvue.priceFrom}</strong>
              </li>
            </ul>
          </div>

          <figure className="sv-alt-frame" data-alt-frame>
            <div className="sv-alt-cam">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-alt-img src="/lp/skyvue/fr/elevation.webp" alt="Vaishno SkyVue's two towers rising above the trees in Tellapur" fetchPriority="high" />
            </div>
            <span className="sv-alt-line" data-alt-line aria-hidden="true">
              <span className="sv-alt-read sv-tnum" data-alt-read>
                {lv.v}
              </span>
            </span>
            <ol className="sv-alt-gauge" aria-label="On the way up">
              {[...altitudeLevels].reverse().map((l) => {
                const i = altitudeLevels.findIndex((x) => x.id === l.id);
                return (
                  <li key={l.id} className={i === level ? "is-on" : i < level ? "is-done" : ""}>
                    <span className="sv-alt-k">{l.k}</span>
                    <span className="sv-alt-d">{l.d}</span>
                  </li>
                );
              })}
            </ol>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 2 · The view (img2threejs) ─────────────────────────
 * The balcony render in 3D: scrolling steps you out towards the railing; the city slides behind
 * the couple with real parallax. Three beats of copy. Reduced motion: the still render. */
const POSES: Photo3DPose[] = [
  { x: 0.035, y: 0.012, z: -0.04, zoom: 1.0, dim: 0.18 },
  { x: 0.0, y: 0.0, z: 0.0, zoom: 1.0, dim: 0.0 }, // reference pose: pixel-exact render
  { x: -0.03, y: -0.008, z: 0.07, zoom: 1.05, dim: 0.0 },
  { x: -0.045, y: -0.012, z: 0.1, zoom: 1.08, dim: 0.12 },
];
const poseAt = (p: number): Photo3DPose => {
  const f = Math.min(POSES.length - 1.0001, p * (POSES.length - 1));
  const i = Math.floor(f);
  const t = ease(f - i);
  const a = POSES[i];
  const b = POSES[i + 1];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t, zoom: a.zoom + (b.zoom - a.zoom) * t, dim: a.dim + (b.dim - a.dim) * t };
};
const beats = [
  { k: "70 ft up", h: "Step out. The noise stays below.", d: "Every home begins above the treetops, over a podium with no cars." },
  { k: "180° views", h: "Evenings that end on the horizon.", d: "Sculpted balconies open wide, east or west." },
  { k: "Up to ~46 ft", h: "A balcony as long as a room.", d: "Extended balconies on select floors, 10′4″ floor to floor." },
];

export function ViewScene() {
  const ref = useRef<HTMLElement>(null);
  const pose = useRef<Photo3DPose>({ ...POSES[1] });
  const [ready, setReady] = useState(false);
  const [use3d, setUse3d] = useState(false);
  useEffect(() => setUse3d(motionOn()), []);

  useAnime(ref, (root) => {
    const panels = [...root.querySelectorAll<HTMLElement>("[data-view-beat]")];
    const update = (p: number) => {
      pose.current = poseAt(p);
      panels.forEach((el, i) => {
        const c = (i + 0.5) / panels.length;
        // first beat is already up when the scene arrives, last one stays until it leaves
        const edge = (i === 0 && p < c) || (i === panels.length - 1 && p > c);
        const d = edge ? 0 : Math.abs(p - c) * panels.length;
        // a long hold per beat and a quick swap, so no screen is left without copy
        const o = Math.min(1, Math.max(0, 1 - (d - 0.36) / 0.14));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * (p < c ? 24 : -24)).toFixed(1)}px, 0)`;
        el.style.filter = `blur(${((1 - o) * 6).toFixed(2)}px)`;
      });
    };
    update(0);
    pinnedScroll(root, update);
  });

  return (
    <section ref={ref} id="view" className="sv-pin sv-view" style={{ ["--pin" as string]: "260svh" }} aria-label="The view from a SkyVue balcony">
      <div className="sv-stage sv-view-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`sv-view-poster ${ready ? "is-hidden" : ""}`} src="/lp/skyvue/3d/balcony-2400.webp" alt="A couple on a SkyVue balcony at night, the city lit up below" loading="lazy" />
        {use3d && (
          <Photo3D
            className="sv-view-canvas"
            color="/lp/skyvue/3d/balcony-2400.webp"
            colorPhone="/lp/skyvue/3d/balcony-1600.webp"
            depth="/lp/skyvue/3d/balcony-depth.png"
            aspect={2400 / 1350}
            getPose={() => pose.current}
            onReady={() => setReady(true)}
          />
        )}
        <div className="sv-view-scrim" aria-hidden="true" />
        <div className="sv-wrap sv-view-copy">
          {beats.map((b) => (
            <div key={b.k} className="sv-view-beat" data-view-beat>
              <p className="sv-frames-eyebrow">{b.k}</p>
              <h2 className="sv-frames-title">{b.h}</h2>
              <p className="sv-frames-body">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 3 · Films (shots kept for this page) ───────────────────────── */
export function PodiumBelow() {
  return (
    <section aria-label="The car-free podium, seen from above">
      <ScrollFrames
        shot="podium-overhead"
        frames={88}
        mobileFrames={44}
        heightClass="[html.motion_&]:h-[160vh] md:[html.motion_&]:h-[190vh]"
        alt="Looking down on SkyVue's landscaped, car-free podium between the towers"
        focusX={0.5}
      >
        <Copy eyebrow="Below you · 0 cars on the podium" title="Look down. No cars, just green." body="Cars park on 6 levels inside the base. The podium is gardens, a Miyawaki forest and play areas." />
      </ScrollFrames>
    </section>
  );
}

export function RooftopAbove() {
  return (
    <section aria-label="The rooftop deck">
      <ScrollFrames
        shot="rooftop"
        frames={86}
        mobileFrames={43}
        heightClass="[html.motion_&]:h-[160vh] md:[html.motion_&]:h-[190vh]"
        alt="The lit rooftop deck and pool at SkyVue at night"
        focusX={0.62}
      >
        <Copy
          eyebrow="Above you · G+5 clubhouse"
          title="And a rooftop for your evenings."
          body="A rooftop pool and deck on the clubhouse, part of 2 lakh sq ft set aside for lifestyle."
          cta={{ label: "Book a site visit", onClick: () => openEnquiry("film-rooftop", "site_visit") }}
        />
      </ScrollFrames>
    </section>
  );
}

/* ───────────────────────── 4 · Down there / Up here ───────────────────────── */
export function DownUp() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} className="sv-section sv-downup" aria-labelledby="downup-title">
      <div className="sv-wrap" data-reveal-group>
        <p className="sv-eyebrow" data-reveal>
          Chaos to calm
        </p>
        <h2 id="downup-title" className="mt-3 max-w-[18ch] text-[30px] leading-[1.08] text-[var(--sv-ink)] sm:text-[46px]" data-reveal>
          The same city. A different altitude.
        </h2>
        <div className="sv-downup-grid mt-10">
          <div className="sv-downup-col is-down" data-reveal>
            <p className="sv-downup-k">Down there</p>
            <ul>
              {contrast.down.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="sv-downup-col is-up" data-reveal>
            <p className="sv-downup-k">Up here, at SkyVue</p>
            <ul>
              {contrast.up.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <button type="button" onClick={() => openEnquiry("downup")} className="sv-btn sv-btn-primary mt-10" data-reveal>
          Get floor plans & cost sheet
        </button>
      </div>
    </section>
  );
}
