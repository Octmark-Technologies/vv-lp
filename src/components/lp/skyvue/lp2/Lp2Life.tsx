"use client";

import Image from "next/image";
import { useRef } from "react";
import { lp2 } from "@/data/skyvue-lp2";
import { revealOnEnter, useAnime } from "../lp1/anim";
import { openEnquiry } from "../lp1/EnquiryDrawer";

const tiles = [lp2.images.amenities.gardens, lp2.images.amenities.care, lp2.images.amenities.family, lp2.images.amenities.work];

/**
 * LP2 · "Life at SkyVue" in one short block: 4 renders (never LP1's) and one line of the rest,
 * in place of the full 40-amenity section, so the page stays short. The full list is in the brochure.
 */
export function Lp2Life() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} className="sv-section bg-white" aria-labelledby="life-title" id="amenities">
      <div className="sv-wrap" data-reveal-group>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="life-title" className="text-[30px] leading-[1.1] text-[var(--sv-heading)] sm:text-[42px]" data-reveal>
            <span className="sv-eyebrow block">{lp2.kw.life}</span>
            <span className="mt-3 block">Everything your family needs, inside the gate.</span>
            </h2>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-[var(--sv-muted)]" data-reveal>
              Experience premium gated community living in Tellapur with 40 amenities, including a Miyawaki forest, rooftop pool, badminton court, pickleball court and landscaped green spaces at Vaishno SkyVue. Discover a lifestyle designed for your family.
            </p>
          </div>
          <button type="button" onClick={() => openEnquiry("life-brochure", "brochure")} className="sv-btn sv-btn-ghost text-[var(--sv-heading)]" data-reveal>
            See all 40 in the brochure
          </button>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" data-reveal>
          {tiles.map((t) => (
            <li key={t.img} className="overflow-hidden rounded-2xl bg-[var(--sv-mist)]">
              <span className="relative block aspect-[4/3]">
                <Image src={t.img} alt={t.caption} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </span>
              <p className="px-3 py-2.5 text-[13.5px] font-semibold text-[var(--sv-heading)]">{t.caption}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[14px] text-[var(--sv-muted)]" data-reveal>
          Also: rooftop pool, clinic and pharmacy, senior citizen gym, pet park, pickleball court and a G+5 clubhouse.
        </p>
      </div>
    </section>
  );
}
