"use client";

import { Suspense, useRef, useState } from "react";
import { animate } from "animejs";
import { formatLakh, skyvue, trackRecord } from "@/data/skyvue-landing";
import { lp2 } from "@/data/skyvue-lp2";
import { HeroCopy, HeroText } from "../HeroCopy";
import { motionOn, pinnedScroll, seg, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { Star } from "../Terms";
import { OfferCountdown } from "../Countdown";
import { Aerial3D, type AerialState } from "./Aerial3D";
import { useHomeSize } from "./useHomeSize";

/**
 * LP2 · the story, told over the SkyVue aerial in 3D (Aerial3D). One held scene, five beats;
 * scrolling flies the camera a little and changes the beat. Different from LP1 by design:
 * no pillar, no tower rise, no line drawing — a dark, cinematic aerial instead.
 *
 * Beats (progress 0 → 1):
 *  0 · hook          reference camera (the render exactly as rendered)
 *  1 · book with 5%  camera eases in and left; towers warm up
 *  2 · pay nothing   an orange construction line climbs the towers, floors count 0 → 36
 *  3 · no-cost EMI   camera rises right; the line rests at the top
 *  4 · possession    camera settles back to the reference view; CTA
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
  const [beat, setBeat] = useState(0);
  const [floors, setFloors] = useState(36);
  const [size] = useHomeSize();
  const last = useRef({ beat: 0, floors: 36 });
  const booking = size * skyvue.basePrice * 0.05;

  useAnime(ref, (root) => {
    const panels = [...root.querySelectorAll<HTMLElement>("[data-beat]")];
    const hookScrim = root.querySelector<HTMLElement>("[data-hookscrim]");
    const update = (p: number) => {
      state.current = poseAt(p);
      // each beat owns 1/5 of the scroll; its text fades in, holds, fades out
      panels.forEach((el, i) => {
        const c = i / (BEATS - 1);
        const d = Math.abs(p - c) * (BEATS - 1);
        const o = i === 0 ? (p < 0.02 ? 1 : Math.max(0, 1 - d * 2.2)) : Math.max(0, 1 - d * 2.2);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((p - c) * -90).toFixed(1)}px)`;
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
        if (i === 0 && hookScrim) hookScrim.style.opacity = o.toFixed(3);
      });
      const b = Math.round(p * (BEATS - 1));
      if (b !== last.current.beat) setBeat((last.current.beat = b));
      const f = Math.round(seg(p, 0.3, 0.72) * 36);
      if (f !== last.current.floors) setFloors((last.current.floors = f));
    };
    update(0);
    // a stand-in animation carries the scroll observer (same pattern as the other scenes)
    animate({ t: 0 }, { t: [0, 1], duration: 1000, ease: "linear", autoplay: pinnedScroll(root, update) });
  });

  const jump = (i: number) => {
    const root = ref.current;
    if (!root || !motionOn()) return;
    const range = root.offsetHeight - innerHeight;
    const top = root.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + (range * i) / (BEATS - 1), behavior: "smooth" });
  };

  const v = lp2.hero[lp2.defaultVersion];
  return (
    <section ref={ref} className="sv-pin sv-story" style={{ ["--pin" as string]: "520svh" }} aria-label="Vaishno SkyVue, the 5% plan">
      <div className="sv-stage sv-story-stage">
        <div className="sv-story-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`sv-story-poster ${ready ? "is-hidden" : ""}`}
            src="/lp/skyvue/fr/aerial.webp"
            alt="Aerial view of Vaishno SkyVue's two towers, podium and clubhouse among trees in Tellapur"
            fetchPriority="high"
          />
          <Aerial3D className="sv-story-canvas" getState={() => state.current} onReady={() => setReady(true)} />
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
                See how it works
              </button>
            </div>
            <OfferCountdown variant="hero" tone="dark" className="sv-cd-start mt-6" />
            <ul className="sv-trust sv-trust-dark mt-6" aria-label="Why buyers trust SkyVue">
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

          {/* Beat 1 · book */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 1</p>
            <h2 className="sv-beat-h">
              Book your home with 5%.
              <Star />
            </h2>
            <p className="sv-beat-p">
              About <strong className="sv-tnum text-white">{formatLakh(booking)}</strong> for a {size.toLocaleString("en-IN")} sq ft exclusive 3 BHK, on the base
              price.
            </p>
          </div>

          {/* Beat 2 · hands-free */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 2</p>
            <h2 className="sv-beat-h">
              Then pay nothing more while your block rises.
              <Star />
            </h2>
            <p className="sv-beat-p">
              <span className="sv-display sv-tnum text-[44px] font-light leading-none text-white">{floors}</span>
              <span className="ml-2">of 36 storeys. You stay at 5% until your block&apos;s structure is complete.</span>
            </p>
          </div>

          {/* Beat 3 · EMI */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 3</p>
            <h2 className="sv-beat-h">
              Structure complete. Now no-cost EMI.
              <Star />
            </h2>
            <p className="sv-beat-p">What follows is spread on no-cost EMI, as per the payment schedule for your home.</p>
          </div>

          {/* Beat 4 · possession */}
          <div data-beat className="sv-beat">
            <p className="sv-beat-k">Step 4</p>
            <h2 className="sv-beat-h">Move in, March 2030.</h2>
            <p className="sv-beat-p">A luxury community of only 570 exclusive 3 BHK homes, with 40 amenities and 75% open space.</p>
            <button type="button" onClick={() => openEnquiry("story-end", "payment_schedule")} className="sv-btn sv-btn-primary mt-6">
              Get my 5% payment schedule
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
            *Conditions apply
          </a>
        </p>
      </div>
    </section>
  );
}
