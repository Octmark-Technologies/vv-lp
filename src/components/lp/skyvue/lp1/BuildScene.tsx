"use client";

import { useRef, useState, type ReactNode } from "react";
import { createTimeline } from "animejs";
import { AnimatePresence, motion } from "motion/react";
import { buildHotspots } from "@/data/skyvue-lp1";
import { motionOn, pinnedScroll, seg, useAnime } from "./anim";

const VW = 2400;
const VH = 1267;
const TOWER_BASE = 0.85; // share of the render's height below which is podium + parking

/**
 * Scene 2 · The build. The towers appear as a line drawing traced from the render, then
 * the real render rises floor by floor (bottom to top) with a floor counter, then five
 * parts of the building light up in turn: parking, podium, where homes begin, clubhouse,
 * towers. The render's pixels are never altered: the drawing is traced from it, and the
 * highlights are outlines over it. Scroll-synced with anime.js; outlines with Motion.
 */
/** What a page can put beside the building instead of the five parts (LP2: the payment meter). */
export type BuildAside = (s: { floors: number; phase: number }) => ReactNode;

/**
 * mode "parts" (LP1): the five parts light up after the rise.
 * mode "pay" (LP2): no part highlights; `aside` gets the floor count and a phase
 * (0 = tower rising, 1 = structure complete, 2 = possession) to tell the payment story.
 */
export function BuildScene({ mode = "parts", aside }: { mode?: "parts" | "pay"; aside?: BuildAside } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [floors, setFloors] = useState(36);
  const [phase, setPhase] = useState(2);
  const last = useRef({ active: -1, floors: 36, phase: 2 });

  useAnime(ref, (root) => {
    const frame = root.querySelector<HTMLElement>("[data-build-frame]")!;
    // Line items, indexed by hotspot order (parking → towers); listed bottom-up beside the building.
    const items = buildHotspots.map((s) => root.querySelector<HTMLElement>(`[data-hot="${s.id}"]`)!);
    const parts = buildHotspots.map((s) => s.value.match(/^(\D*)(\d+)(.*)$/));
    const step = (0.98 - 0.56) / buildHotspots.length;
    const paintItems = (p: number) => {
      items.forEach((li, i) => {
        if (!li) return;
        // 1 · arrive bottom-up while the floors rise, the figure counting up with the scroll
        const inn = seg(p, 0.12 + i * 0.07, 0.24 + i * 0.07);
        li.style.setProperty("--in", inn.toFixed(3));
        const m = parts[i];
        const v = li.querySelector<HTMLElement>(".v");
        if (m && v) v.textContent = `${m[1]}${Math.round(Number(m[2]) * seg(inn, 0.15, 1))}${m[3]}`;
        // 2 · its own progress line fills while its part of the building is lit
        li.style.setProperty("--p", seg(p, 0.56 + i * step, 0.56 + (i + 1) * step).toFixed(3));
      });
    };
    const update = (p: number) => {
      paintItems(p);
      const revealed = seg(p, 0.1, 0.52);
      const f = Math.round(seg(revealed, 1 - TOWER_BASE, 1) * 36);
      const a = mode === "pay" || p < 0.56 ? -1 : Math.min(buildHotspots.length - 1, Math.floor(seg(p, 0.56, 0.98) * buildHotspots.length));
      const ph = p < 0.54 ? 0 : p < 0.76 ? 1 : 2;
      if (ph !== last.current.phase) {
        last.current.phase = ph;
        setPhase(ph);
      }
      if (f !== last.current.floors) {
        last.current.floors = f;
        setFloors(f);
      }
      if (a !== last.current.active) {
        last.current.active = a;
        setActive(a);
      }
    };
    update(0);
    createTimeline({ autoplay: pinnedScroll(root, update), defaults: { ease: "linear" } })
      .add(frame, { "--reveal": ["100%", "0%"], duration: 420 }, 100)
      .add("[data-build-edge]", { opacity: [0, 1], duration: 30 }, 100)
      .add("[data-build-edge]", { opacity: [1, 0], duration: 30 }, 500)
      .add("[data-build-line]", { opacity: [1, 0.25], duration: 60 }, 480)
      .add({ duration: 1 }, 1000);
  });

  const h = active >= 0 ? buildHotspots[active] : null;

  /** Scroll to the moment in the scene where this part is lit (works both ways). */
  const jumpTo = (i: number) => {
    const root = ref.current;
    if (!root || !motionOn()) return;
    const range = root.offsetHeight - innerHeight;
    const step = (0.98 - 0.56) / buildHotspots.length;
    const top = root.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + range * (0.56 + (i + 0.55) * step), behavior: "smooth" });
  };

  return (
    <section ref={ref} className="sv-pin sv-build sv-sky" style={{ ["--pin" as string]: "420svh" }} aria-labelledby="build-title">
      <div className="sv-stage">
        <div className="sv-wrap h-full py-[max(72px,9svh)]">
          <div className="sv-build-grid">
            <div className="min-w-0">
              <div data-build-frame className="sv-build-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-build-line src="/lp/skyvue/scroll/towers-full-lineart-2400.webp" alt="" aria-hidden="true" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="sv-build-render"
                  src="/lp/skyvue/scroll/towers-full-alpha-2400.webp"
                  srcSet="/lp/skyvue/scroll/towers-full-alpha-1200.webp 1200w, /lp/skyvue/scroll/towers-full-alpha-2400.webp 2400w"
                  sizes="(min-width: 1000px) 60vw, 100vw"
                  alt="SkyVue's two 36-storey towers, podium and clubhouse"
                  loading="lazy"
                />
                <span data-build-edge className="sv-build-edge" aria-hidden="true" />
                <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                  <defs>
                    {/* Darkens and cools the building only (the render has its own transparency). */}
                    <filter id="sv-build-dim" colorInterpolationFilters="sRGB">
                      <feColorMatrix type="matrix" values="0.30 0 0 0 0.02  0 0.34 0 0 0.05  0 0 0.42 0 0.10  0 0 0 1 0" />
                    </filter>
                    <mask id="sv-build-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VW} height={VH}>
                      <rect width={VW} height={VH} fill="white" />
                      {h && (
                        <motion.rect
                          fill="black"
                          rx={14}
                          initial={false}
                          animate={{ x: h.x * VW - 10, y: h.y * VH - 10, width: h.w * VW + 20, height: h.h * VH + 20 }}
                          transition={{ type: "spring", stiffness: 140, damping: 22 }}
                        />
                      )}
                    </mask>
                  </defs>
                  <AnimatePresence>
                    {h && (
                      <motion.g key="dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <image
                          href="/lp/skyvue/scroll/towers-full-alpha-1200.webp"
                          width={VW}
                          height={VH}
                          preserveAspectRatio="none"
                          filter="url(#sv-build-dim)"
                          mask="url(#sv-build-mask)"
                        />
                        <motion.rect
                          fill="none"
                          stroke="var(--sv-orange)"
                          strokeWidth={5}
                          rx={14}
                          initial={false}
                          animate={{ x: h.x * VW - 10, y: h.y * VH - 10, width: h.w * VW + 20, height: h.h * VH + 20 }}
                          transition={{ type: "spring", stiffness: 140, damping: 22 }}
                        />
                      </motion.g>
                    )}
                  </AnimatePresence>
                </svg>
                <AnimatePresence mode="wait">
                  {h && (
                    <motion.div
                      key={h.id}
                      className="pointer-events-none absolute z-10 rounded-full bg-[var(--sv-orange)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg sm:text-xs"
                      style={{ left: `${(h.x + 0.01) * 100}%`, top: `max(6px, calc(${h.y * 100}% - 40px))` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      {h.value} · {h.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {mode === "pay" && aside ? (
              <div className="min-w-0">{aside({ floors, phase })}</div>
            ) : (
            <div className="min-w-0">
              <p className="sv-eyebrow">Built for 570 families</p>
              <h2 id="build-title" className="mt-3 text-[28px] leading-tight text-[var(--sv-ink)] sm:text-[40px]">
                Cars stay below. Homes begin 70&nbsp;ft up.
              </h2>
              <p className="mt-4 flex items-baseline gap-3 text-[var(--sv-muted)]">
                <span className="sv-display sv-tnum text-[44px] font-light leading-none text-[var(--sv-navy)] sm:text-[56px]">
                  {String(floors).padStart(2, "0")}
                </span>
                <span className="text-sm uppercase tracking-[0.2em]">of 36 storeys</span>
              </p>
              <ol className="sv-hot-list mt-6">
                {[...buildHotspots].reverse().map((s) => {
                  const i = buildHotspots.findIndex((b) => b.id === s.id);
                  return (
                    <li key={s.id} data-hot={s.id} className={i === active ? "is-on" : active > i ? "is-done" : ""}>
                      <button type="button" onClick={() => jumpTo(i)} aria-current={i === active ? "step" : undefined}>
                        <span className="v sv-tnum">{s.value}</span>
                        <span>
                          <span className="block font-semibold text-[var(--sv-ink)]">{s.label}</span>
                          <span className="n text-[13px] text-[var(--sv-muted)]">{s.note}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
