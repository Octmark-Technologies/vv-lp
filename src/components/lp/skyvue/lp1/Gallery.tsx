"use client";

import Image from "next/image";
import { useRef } from "react";
import { animate } from "animejs";
import { gallery } from "@/data/skyvue-lp1";
import { pinnedScroll, useAnime } from "./anim";

/**
 * B8 · Life at SkyVue. On desktop the section pins and vertical scroll slides the
 * Final Renders sideways (anime.js, scroll-synced). On phones it is a native swipe row.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null);

  useAnime(ref, (root) => {
    if (innerWidth < 900) return;
    const track = root.querySelector<HTMLElement>("[data-track]")!;
    const viewport = root.querySelector<HTMLElement>("[data-viewport]")!;
    const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    root.style.setProperty("--pin", `calc(100svh + ${distance}px)`);
    animate(track, { translateX: [0, -distance], ease: "linear", duration: 1000, autoplay: pinnedScroll(root) });
  });

  return (
    <section ref={ref} className="sv-pin sv-gallery bg-[var(--sv-paper)]" style={{ ["--pin" as string]: "260svh" }} aria-labelledby="life-title" id="life">
      <div className="sv-stage flex flex-col justify-center py-16 md:py-0">
        <div className="sv-wrap">
          <p className="sv-eyebrow">
            Life at SkyVue
          </p>
          <h2 id="life-title" className="mt-3 max-w-3xl text-[30px] leading-[1.1] text-[var(--sv-ink)] sm:text-[44px]">
            2 lakh sq ft for lifestyle. A forest inside the gate.
          </h2>
        </div>
        <div data-viewport className="sv-gallery-viewport mt-10 pl-[max(16px,env(safe-area-inset-left,0px))] md:pl-[max(32px,calc((100vw-1200px)/2+32px))]">
          <ul data-track className="sv-gallery-track pr-8">
            {gallery.map((g, n) => (
              <li key={g.title} className="sv-gallery-card">
                <figure>
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--sv-mist)]">
                    <Image src={g.img} alt={`${g.title} at SkyVue`} fill sizes="(min-width: 900px) 520px, 78vw" className="object-cover" loading={n < 2 ? "eager" : "lazy"} />
                  </span>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                    <span>
                      <span className="block text-[16px] font-semibold text-[var(--sv-ink)]">{g.title}</span>
                      <span className="text-[13px] text-[var(--sv-muted)]">{g.note}</span>
                    </span>
                    <span className="sv-display sv-tnum text-[13px] text-[var(--sv-muted)]">
                      {String(n + 1).padStart(2, "0")}/{gallery.length}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
