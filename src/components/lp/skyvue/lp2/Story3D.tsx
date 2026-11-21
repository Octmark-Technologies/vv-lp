"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { skyvue } from "@/data/skyvue-landing";
import { lp2 } from "@/data/skyvue-lp2";
import { HeroCopy, HeroText } from "../HeroCopy";
import { motionOn, pinnedScroll, seg, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { Star } from "../Terms";
import { OfferCountdown } from "../Countdown";
import { Aerial3D, type AerialState } from "./Aerial3D";

/**
 * LP2 · the story, told over the SkyVue aerial in 3D (Aerial3D). One held scene, five beats;
 * scrolling flies the camera a little and changes the beat. Different from LP1 by design:
 * no pillar, no tower rise, no line drawing — a dark, cinematic aerial instead.
 *
 * Beats (progress 0 → 1) · Pay Your Way (20 Nov 2026):
 *  0 · hook                 reference camera (the render exactly as rendered)
 *  1 · your amounts & dates camera eases in and left; towers warm up
 *  2 · written quote        an orange line climbs the towers
 *  3 · book & register      camera rises right; the line rests at the top
 *  4 · the deadline         ₹7,149 until 31 Dec, then ₹7,399; camera settles back; CTA
 *
 * Without motion: the image is a plain <img>, and the beats are ordinary stacked content.
 */
const POSES: AerialState[] = [
  { x: 0, y: 0, z: 0, zoom: 1, band: -1, glow: 0, focus: 0 },
  { x: -0.11, y: 0.03, z: 0.18, zoom: 1.18, band: -1, glow: 0.5, focus: 0.35 },
  { x: 0.1, y: -0.04, z: 0.26, zoom: 1.3, band: 0, glow: 0.7, focus: 0.55 },
  { x: 0.12, y: 0.07, z: 0.14, zoom: 1.14, band: 1, glow: 0.6, focus: 0.45 },
  { x: -0.03, y: 0.02, z: 0.05, zoom: 1.04, band: -1, glow: 0.2, focus: 0.1 },
];
const BEATS = POSES.length;
const ease = (t: number) => t * t * (3 - 2 * t);

function poseAt(p: number): AerialState {
  const f = Math.min(BEATS - 1 - 1e-6, Math.max(0, p * (BEATS - 1)));
  const i = Math.floor(f);
  const t = ease(f - i);
  const a = POSES[i];
  const b = POSES[i + 1];
  const out = {} as AerialState;
  (Object.keys(a) as (keyof AerialState)[]).forEach((k) => (out[k] = a[k] + (b[k] - a[k]) * t));
  // the line climbs through beat 2 → 3 only
  out.band = p < 0.25 || p > 0.8 ? -1 : seg(p, 0.3, 0.72);
  return out;
}

export function Story3D() {
  const ref = useRef<HTMLElement>(null);
  const state = useRef<AerialState>({ ...POSES[0] });
  const [ready, setReady] = useState(false);
  // The 3D view only loads when motion is on; with animations off the render is a plain image.
  const [use3d, setUse3d] = useState(false);
  useEffect(() => setUse3d(motionOn()), []);
  const [beat, setBeat] = useState(0);
  const last = useRef({ beat: 0 });

  useAnime(ref, (root) => {
    const panels = [...root.querySelectorAll<HTMLElement>("[data-beat]")];
    const hookScrim = root.querySelector<HTMLElement>("[data-hookscrim]");
    const update = (p: number) => {
      state.current = poseAt(p);
      // each beat owns 1/5 of the scroll; its text fades in, holds, fades out
      panels.forEach((el, i) => {
        const c = i / (BEATS - 1);
        const d = Math.abs(p - c) * (BEATS - 1);
        // long hold, quick swap: some step is always on screen
        const hold = (i === 0 && p < c) || (i === BEATS - 1 && p > c) ? 0 : d;
        const o = Math.min(1, Math.max(0, 1 - (hold - 0.32) / 0.14));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * (p < c ? 28 : -28)).toFixed(1)}px)`;
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
        if (i === 0 && hookScrim) hookScrim.style.opacity = o.toFixed(3);
      });
      const b = Math.round(p * (BEATS - 1));
      if (b !== last.current.beat) setBeat((last.current.beat = b));
    };
    update(0);
    // a stand-in animation carries the scroll observer (same pattern as the other scenes)
    animate({ t: 0 }, { t: [0, 1], duration: 1000, ease: "linear", autoplay: pinnedScroll(root, update) });
  });

  const jump = (i: number) => {
    const root = ref.current;
    if (!root) return;
    if (!motionOn()) {
      // Animations off: the steps are ordinary stacked content, so go straight to the one asked for.
      root.querySelectorAll<HTMLElement>("[data-beat]")[i]?.scrollIntoView({ block: "start" });
      return;
    }
    const range = root.offsetHeight - innerHeight;
    const top = root.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + (range * i) / (BEATS - 1), behavior: "smooth" });
  };

  const v = lp2.hero[lp2.defaultVersion];
  return (
    <section ref={ref} className="sv-pin sv-story" style={{ ["--pin" as string]: "210svh" }} aria-label="Vaishno SkyVue, Pay Your Way">
      <div className="sv-stage sv-story-stage">
        <div className="sv-story-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`sv-story-poster ${ready ? "is-hidden" : ""}`}
            src="/lp/skyvue/fr/aerial.webp"
            alt="Aerial view of Vaishno SkyVue's two towers, podium and clubhouse among trees in Tellapur"
            fetchPriority="high"
          />
          {use3d && <Aerial3D className="sv-story-canvas" getState={() => state.current} onReady={() => setReady(true)} />}
          <div className="sv-story-scrim" aria-hidden="true" />
        </div>
        <div data-hookscrim className="sv-story-hookscrim" aria-hidden="true" />

        <div className="sv-wrap sv-story-copy">
          {/* Beat 0 · hook */}
          <div data-beat className="sv-beat sv-beat-hook">
            <Suspense fallback={<HeroText copy={v} tone="dark" />}>
              <HeroCopy copies={lp2.hero} fallback={lp2.defaultVersion} tone="dark" />
            </Suspense>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => openEnquiry("hero", "payment_schedule")} className="sv-btn sv-btn-primary">
                {lp2.heroCta}
              </button>
              <button type="button" onClick={() => jump(1)} className="sv-btn sv-btn-ghost text-white">
                How Pay Your Way works
              </button>
            </div>
            <OfferCountdown variant="hero" tone="dark" className="sv-cd-start mt-6" />
            <ul className="sv-trust sv-trust-dark mt-6" aria-label="Why buyers trust SkyVue">
              <li>
                <strong>TS RERA</strong> {skyvue.rera}
              </li>
              <li>
                <strong>₹7,149</strong> per sq ft until 31 Dec
                <Star />
              </li>
              <li>
                <strong>3 BHK</strong> only, 2,010 to 2,890 sq ft
              </li>
            </ul>
          </div>

          {/* Beat 1 · your plan */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 1</p>
            <h2 className="sv-beat-h">Tell us your amounts and dates.</h2>
            <p className="sv-beat-p">Own funds, home loan or both. Salary dates, bonus month, an FD or a flat sale: your plan follows your money.</p>
          </div>

          {/* Beat 2 · quote */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 2</p>
            <h2 className="sv-beat-h">Visit the site. Leave with a written quote.</h2>
            <p className="sv-beat-p">Sales prepares the quote for the schedule you propose, with a quote number. Not three plans to pick from. One plan: yours.</p>
          </div>

          {/* Beat 3 · book */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 3</p>
            <h2 className="sv-beat-h">
              Book your home, then register.
              <Star />
            </h2>
            <p className="sv-beat-p">A token of up to 10% books your home. Your rate and schedule go into the registered sale agreement.</p>
          </div>

          {/* Beat 4 · deadline */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">The one price</p>
            <h2 className="sv-beat-h">
              ₹7,149 per sq ft until 31 December.
              <Star />
            </h2>
            <p className="sv-beat-p">From 1 January 2027 it is ₹7,399 per sq ft. Possession planned for 31 March 2030.</p>
            <button type="button" onClick={() => openEnquiry("story-end", "payment_schedule")} className="sv-btn sv-btn-primary mt-6">
              {lp2.heroCta}
            </button>
          </div>
        </div>

        <ol className="sv-story-dots" aria-label="Story steps">
          {Array.from({ length: BEATS }, (_, i) => (
            <li key={i}>
              <button type="button" aria-label={`Go to step ${i}`} aria-current={i === beat ? "step" : undefined} className={i === beat ? "is-on" : ""} onClick={() => jump(i)} />
            </li>
          ))}
        </ol>
        <p className="sv-story-note">
          <a href="#terms" className="underline underline-offset-2">
            *Price terms
          </a>
        </p>
      </div>
    </section>
  );
}
