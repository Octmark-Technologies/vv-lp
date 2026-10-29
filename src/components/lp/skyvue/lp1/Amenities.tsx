"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { animate, onScroll } from "animejs";
import { amenityCount, amenityExtras, amenityGroups } from "@/data/skyvue-landing";
import { motionOn, pinnedScroll, seg, useAnime } from "./anim";
import { openEnquiry } from "./EnquiryDrawer";
import { useLpMaybe } from "./PageConfig";

/**
 * Amenities · 40 amenities from the brochure master plan, in 4 groups.
 * Desktop: the section holds while you scroll; the groups take turns (tabs fill with the
 * scroll), each group's items light one by one, and its render changes beside them.
 * Phones: the groups stack; each group's items light as it passes through the screen.
 * Without motion: all groups, all items, full opacity.
 */
export function Amenities() {
  const ref = useRef<HTMLElement>(null);
  const pics = useLpMaybe()?.images?.amenities ?? {};
  const [active, setActive] = useState(0);
  const last = useRef(0);

  useAnime(ref, (root) => {
    const groups = [...root.querySelectorAll<HTMLElement>("[data-group]")];
    const tabs = [...root.querySelectorAll<HTMLElement>("[data-tab]")];
    const light = (g: HTMLElement, local: number) => {
      const items = [...g.querySelectorAll<HTMLElement>("[data-item]")];
      items.forEach((li, k) => {
        const a = (k / items.length) * 0.75;
        li.style.setProperty("--in", seg(local, a, a + 0.25).toFixed(3));
      });
    };

    // Count up the total as the section arrives.
    const count = root.querySelector<HTMLElement>("[data-amen-count]");
    if (count) {
      const box = { v: 0 };
      count.textContent = "0";
      animate(box, {
        v: amenityCount,
        duration: 1400,
        ease: "outExpo",
        onUpdate: () => (count.textContent = String(Math.round(box.v))),
        autoplay: onScroll({ target: root, enter: { target: "top", container: "bottom-=120" }, repeat: false }),
      });
    }

    if (innerWidth >= 1000) {
      const n = groups.length;
      const track = { t: 0 };
      const update = (p: number) => {
        const pos = Math.min(n - 0.0001, p * n * 1.04);
        const a = Math.floor(pos);
        groups.forEach((g, i) => light(g, i < a ? 1 : i > a ? 0 : pos - a));
        tabs.forEach((t, i) => t.style.setProperty("--p", Math.max(0, Math.min(1, pos - i)).toFixed(3)));
        if (a !== last.current) {
          last.current = a;
          setActive(a);
        }
      };
      groups.forEach((g) => light(g, 0));
      // The observer is linked to a stand-in animation so anime.js drives it like the other scenes.
      animate(track, { t: [0, 1], ease: "linear", duration: 1000, autoplay: pinnedScroll(root, update) });
    } else {
      groups.forEach((g) => {
        light(g, 0);
        animate(
          { t: 0 },
          { t: [0, 1], ease: "linear", duration: 1000, autoplay: onScroll({ target: g, enter: "bottom top", leave: "center center", sync: 0.25, onUpdate: (self) => light(g, self.progress) }) },
        );
      });
    }
  });

  /** Tabs scroll to their group's moment in the held section (both directions). */
  const jumpTo = (i: number) => {
    const root = ref.current;
    if (!root) return;
    if (!motionOn() || innerWidth < 1000) {
      root.querySelectorAll<HTMLElement>("[data-group]")[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const range = root.offsetHeight - innerHeight;
    const top = root.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + range * ((i + 0.55) / amenityGroups.length / 1.04), behavior: "smooth" });
  };

  return (
    <section ref={ref} className="sv-pin sv-amen bg-[var(--sv-paper)]" style={{ ["--pin" as string]: "280svh" }} aria-labelledby="amen-title" id="amenities">
      <div className="sv-stage">
        <div className="sv-wrap sv-amen-wrap">
          <div className="sv-amen-head">
            <div className="min-w-0">
              <p className="sv-eyebrow">Amenities · Exclusive to 570 families</p>
              <h2 id="amen-title" className="mt-3 text-[28px] leading-tight text-[var(--sv-ink)] sm:text-[40px]">
                <span data-amen-count className="sv-tnum">
                  {amenityCount}
                </span>{" "}
                amenities. One luxury community.
              </h2>
            </div>
            <div role="tablist" aria-label="Amenity groups" className="sv-amen-tabs">
              {amenityGroups.map((g, i) => (
                <button key={g.id} type="button" role="tab" data-tab aria-selected={i === active} onClick={() => jumpTo(i)} className={i === active ? "is-on" : ""}>
                  {g.title}
                  <span className="sv-tnum"> · {g.items.length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sv-amen-groups">
            {amenityGroups.map((g, i) => (
              <article key={g.id} data-group className={`sv-amen-group ${i === active ? "is-on" : ""}`} aria-labelledby={`amen-${g.id}`}>
                <figure className="sv-amen-fig">
                  <span className="relative block w-full overflow-hidden rounded-3xl bg-[var(--sv-mist)]">
                    <Image src={pics[g.id]?.img ?? g.img} alt={`${pics[g.id]?.caption ?? g.caption} at SkyVue`} fill sizes="(min-width: 1000px) 46vw, 100vw" className="object-cover" />
                  </span>
                  <figcaption className="mt-2 text-[12px] text-[var(--sv-muted)]">{pics[g.id]?.caption ?? g.caption}</figcaption>
                </figure>
                <div className="min-w-0">
                  <h3 id={`amen-${g.id}`} className="text-[24px] leading-tight text-[var(--sv-ink)] sm:text-[30px]">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-[15px] text-[var(--sv-muted)]">{g.line}</p>
                  <ul className="sv-amen-list mt-5">
                    {g.items.map((it) => (
                      <li key={it} data-item>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="sv-amen-foot">
            <p className="text-[13px] text-[var(--sv-muted)]">
              Also at SkyVue: {amenityExtras.join(", ")}. Listed from the SkyVue master plan.
            </p>
            <button type="button" onClick={() => openEnquiry("amenities")} className="sv-btn sv-btn-primary">
              Get the amenities brochure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
