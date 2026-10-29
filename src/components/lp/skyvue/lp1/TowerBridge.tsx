"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { motionOn } from "./anim";

/**
 * Bridge · Scene 1 → Scene 2 (Motion: useScroll + useTransform + useSpring, scroll-linked).
 *
 * When the opening's pin ends, its towers detach from the section and glide, scroll for scroll,
 * into the frame of "Built for 570 families". On the way the close-up render hands over to the
 * full render (the SkyVue tower is kept in register so it reads as one camera pulling back), and
 * the full render settles into the traced line drawing that the build scene starts from.
 * Scrolling back plays it in reverse. Neither render's pixels are altered.
 *
 * Range: from the end of the opening's pin to the start of the build scene's pin (one screen).
 * The real images in both sections are hidden only while the bridge is in flight.
 */

type Box = { x: number; y: number; w: number; h: number };
type Geo = { start: number; end: number; from: Box; to: Box };

const CLOSE_AR = 1178 / 1200; // h / w of towers-closeup-alpha
const FULL_AR = 1267 / 2400; // h / w of towers-full-alpha and the line drawing

// The SkyVue tower (the one carrying the SkyVue sign), measured on each render as fractions.
const CLOSE_TOWER = { x: 0.346, y: 0.0, w: 0.487 };
const FULL_TOWER = { x: 0.42, y: 0.105, w: 0.22 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Where the full render sits when its SkyVue tower is laid over the close-up's. */
function fullOverClose(c: Box): Box {
  const w = (c.w * CLOSE_TOWER.w) / FULL_TOWER.w;
  const h = w * FULL_AR;
  return { x: c.x + CLOSE_TOWER.x * c.w - FULL_TOWER.x * w, y: c.y + CLOSE_TOWER.y * c.h - FULL_TOWER.y * h, w, h };
}
/** Where the close-up sits when its SkyVue tower is laid over the full render's. */
function closeOverFull(f: Box): Box {
  const w = (f.w * FULL_TOWER.w) / CLOSE_TOWER.w;
  const h = w * CLOSE_AR;
  return { x: f.x + FULL_TOWER.x * f.w - CLOSE_TOWER.x * w, y: f.y + FULL_TOWER.y * f.h - CLOSE_TOWER.y * h, w, h };
}
const mix = (a: Box, b: Box, t: number): Box => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

function measure(): Geo | null {
  const open = document.querySelector<HTMLElement>(".sv-open");
  const build = document.querySelector<HTMLElement>(".sv-build");
  const towers = open?.querySelector<HTMLImageElement>("[data-open-towers]");
  const frame = build?.querySelector<HTMLElement>("[data-build-frame]");
  if (!open || !build || !towers || !frame) return null;
  const openStage = open.querySelector<HTMLElement>(".sv-stage")!;
  const buildStage = build.querySelector<HTMLElement>(".sv-stage")!;
  const openTop = open.getBoundingClientRect().top + scrollY;
  const start = openTop + open.offsetHeight - innerHeight;
  const end = build.getBoundingClientRect().top + scrollY;

  // From: the close-up's box while the opening is pinned, read without the opening's own transform.
  const saved = towers.style.transform;
  towers.style.transform = "none";
  const tr = towers.getBoundingClientRect();
  towers.style.transform = saved;
  const os = openStage.getBoundingClientRect();
  const from: Box = { x: tr.left, y: tr.top - os.top, w: tr.width, h: tr.height };

  // To: the build frame's box while the build scene is pinned.
  const fr = frame.getBoundingClientRect();
  const bs = buildStage.getBoundingClientRect();
  const to: Box = { x: fr.left, y: fr.top - bs.top, w: fr.width, h: fr.height };
  return { start, end: Math.max(end, start + 1), from, to };
}

export function TowerBridge() {
  const [on, setOn] = useState(false);
  const geo = useRef<Geo | null>(null);
  const [src, setSrc] = useState<Record<Kind, string>>(SRC);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (!motionOn()) return;
    const update = () => {
      geo.current = measure();
      // Fly the very files the sections already decoded, so the hand-off has no resolution jump or decode hitch.
      const pick = (sel: string, fallback: string) => document.querySelector<HTMLImageElement>(sel)?.currentSrc || fallback;
      setSrc({
        close: pick(".sv-open [data-open-towers]", SRC.close),
        full: pick(".sv-build .sv-build-render", SRC.full),
        line: pick(".sv-build [data-build-line]", SRC.line),
      });
    };
    const t = setTimeout(update, 60);
    // Re-measure whenever either end changes size (late CSS, image decode, fonts), not just the page.
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    document.querySelectorAll<HTMLElement>(".sv-build [data-build-frame], .sv-open [data-open-towers]").forEach((el) => ro.observe(el));
    addEventListener("resize", update);
    addEventListener("load", update);
    document.fonts?.ready.then(update);
    setOn(true);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      removeEventListener("resize", update);
      removeEventListener("load", update);
    };
  }, []);

  // raw: exact scroll progress — keeps both ends glued to their sections, frame for frame.
  // morph: the same progress through a soft spring — drives the glide and the hand-overs,
  // so quick flicks of the wheel or trackpad come out as one continuous move.
  const raw = useTransform(scrollY, (y) => {
    const g = geo.current;
    return g ? clamp01((y - g.start) / (g.end - g.start)) : 0;
  });
  const morph = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.8, restDelta: 0.0002 });

  // The real images hide only while the bridge is in flight (by either value).
  const sync = () => {
    const r = raw.get();
    const m = morph.get();
    const flying = (r > 0 && r < 1) || (m > 0.002 && m < 0.998);
    const root = document.documentElement;
    // Take-off: read both ends again so the glide always lands on the frame's real size.
    if (flying && root.dataset.bridge !== "true") geo.current = measure() ?? geo.current;
    if (root.dataset.bridge !== String(flying)) root.dataset.bridge = String(flying);
  };
  useMotionValueEvent(raw, "change", sync);
  useMotionValueEvent(morph, "change", sync);
  useEffect(() => () => void delete document.documentElement.dataset.bridge, []);

  if (!on) return null;
  return (
    <div className="sv-bridge" aria-hidden="true">
      {/* Stacking: full render underneath, close-up over it, drawing on top — each hand-over is one
          opaque layer revealing another, never two half-transparent pictures. */}
      <Layer raw={raw} morph={morph} geo={geo} kind="full" src={src.full} />
      <Layer raw={raw} morph={morph} geo={geo} kind="close" src={src.close} />
      <Layer raw={raw} morph={morph} geo={geo} kind="line" src={src.line} />
    </div>
  );
}

type Kind = "close" | "full" | "line";
const SRC: Record<Kind, string> = {
  close: "/lp/skyvue/scroll/towers-closeup-alpha-2400.webp",
  full: "/lp/skyvue/scroll/towers-full-alpha-2400.webp",
  line: "/lp/skyvue/scroll/towers-full-lineart-2400.webp",
};

const smooth = (t: number) => t * t * (3 - 2 * t); // smoothstep for the fades

function Layer({ raw, morph, geo, kind, src }: { raw: MotionValue<number>; morph: MotionValue<number>; geo: React.RefObject<Geo | null>; kind: Kind; src: string }) {
  const box = (r: number, m: number): Box | null => {
    const g = geo.current;
    if (!g) return null;
    // Ends ride with their sections on the exact scroll; only the glide between them is sprung.
    const d = g.end - g.start;
    const from = { ...g.from, y: g.from.y - r * d };
    const to = { ...g.to, y: g.to.y + (1 - r) * d };
    const t = ease(seg(m, 0, 0.88));
    if (kind === "close") return mix(from, closeOverFull(to), t);
    return mix(fullOverClose(from), to, t);
  };
  const base = (): Box | null => {
    const g = geo.current;
    return g ? (kind === "close" ? g.from : g.to) : null;
  };
  const both = [raw, morph] as const;
  const x = useTransform(both as unknown as MotionValue<number>[], ([r, m]: number[]) => box(r, m)?.x ?? 0);
  const y = useTransform(both as unknown as MotionValue<number>[], ([r, m]: number[]) => box(r, m)?.y ?? 0);
  const scale = useTransform(both as unknown as MotionValue<number>[], ([r, m]: number[]) => {
    const b = box(r, m);
    const b0 = base();
    return b && b0 ? b.w / b0.w : 1;
  });
  const opacity = useTransform(both as unknown as MotionValue<number>[], ([r, m]: number[]) => {
    const flying = (r > 0 && r < 1) || (m > 0.002 && m < 0.998);
    if (!flying) return 0;
    if (kind === "full") return smooth(seg(m, 0.08, 0.3)) * (1 - smooth(seg(m, 0.9, 1))); // rises under the close-up, gives way to the drawing at the very end
    if (kind === "close") return 1 - smooth(seg(m, 0.22, 0.52)); // dissolves to reveal the full render beneath
    return smooth(seg(m, 0.7, 0.96)); // the drawing draws over the render as it lands
  });
  // A little focus pull while the close-up dissolves: reads as one camera pulling back.
  const filter = useTransform(morph, (m) => {
    if (kind === "close") return `blur(${(smooth(seg(m, 0.2, 0.5)) * 4).toFixed(2)}px)`;
    if (kind === "full") return `blur(${((1 - smooth(seg(m, 0.22, 0.45))) * 2.5).toFixed(2)}px)`;
    return "none";
  });
  const b0 = base();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <motion.img
      src={src}
      alt=""
      decoding="async"
      className="sv-bridge-img"
      style={{ x, y, scale, opacity, filter, width: b0?.w ?? 0, height: b0?.h ?? 0 }}
    />
  );
}
