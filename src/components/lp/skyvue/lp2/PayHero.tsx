"use client";

import { Suspense } from "react";
import { lp2 } from "@/data/skyvue-lp2";
import { skyvue } from "@/data/skyvue-landing";
import { HeroCopy, HeroText } from "../HeroCopy";
import { ScrollFrames } from "../ScrollFrames";
import { openEnquiry } from "../lp1/EnquiryDrawer";
import { Star } from "../Terms";

/**
 * LP2 · Pay Your Way hero: one 9-second scroll film from "SkyVue Final 4K V-02.mp4" (timecode
 * 01:03:28:12–01:03:37:14). The tower close-up with the lit SkyVue sign, then a cut to the long shot
 * of both towers from the road. Desktop: 72 frames at 8 fps, 1920px (the long shot re-framed from
 * the 4K master so the towers sit right of the copy). Phones get their own portrait frames
 * (54 at 6 fps, 720 x 1280) composed from the 4K master: each shot framed whole (sign and facade,
 * then both towers) in the top half, fading into navy where the copy sits. Reduced motion: one still frame. The family clip (pay-plan)
 * plays further down, in PayFilm.
 */
export function PayHero() {
  const v = lp2.hero[lp2.defaultVersion];
  return (
    <section aria-label="Vaishno SkyVue, Pay Your Way" className="sv-payhero sv-payhero-left" id="pay-hero">
      <ScrollFrames
        shot="skyvue-dusk"
        frames={72}
        mobileFrames={54}
        heightClass="[html.motion_&]:h-[180svh]"
        alt="Vaishno SkyVue at dusk: the lit SkyVue sign up close, then both towers from the road"
        focusX={0.7}
        focusXMobile={0.5}
        still={20}
        eager
      >
        <div className="sv-payhero-scrim" aria-hidden="true" />
        <div className="sv-payhero-copy">
          <div className="sv-wrap">
            <div className="sv-payhero-inner">
              <Suspense fallback={<HeroText copy={v} tone="dark" kicker={lp2.h1} />}>
                <HeroCopy copies={lp2.hero} fallback={lp2.defaultVersion} tone="dark" kicker={lp2.h1} />
              </Suspense>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => openEnquiry("hero", "payment_schedule")} className="sv-btn sv-btn-primary">
                  {lp2.heroCta}
                </button>
                <a href="#your-price" className="sv-btn sv-btn-ghost sv-payhero-link text-white">
                  How it works
                </a>
              </div>
              <ul className="sv-trust sv-trust-dark mt-6" aria-label="Key facts">
                <li>
                  <strong>₹7,399</strong> per sq ft · No-cost EMI till 31 Dec
                  <Star />
                </li>
                <li>
                  <strong>TS RERA</strong> {skyvue.rera}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollFrames>
    </section>
  );
}
