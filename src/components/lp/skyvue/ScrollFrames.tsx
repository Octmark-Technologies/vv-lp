"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-driven frame sequence (canvas, rAF, passive scroll).
 *
 * - A tall wrapper (`heightClass`) holds a sticky full-screen stage with a <canvas>.
 * - Scroll progress through the wrapper maps to the frame index; a frame is drawn only when the index changes.
 * - Frames: /frames/<shot>/f_0001.webp (desktop, 1920 px, 24 fps) and /frames/<shot>-m/ (960 px, 12 fps) under 768 px.
 * - Loading: the first 10 frames after the page has loaded (low priority), the rest once the section is near the viewport.
 * - Reduced motion or no JS (html.motion absent): a single still frame, no tall wrapper, nothing else loads.
 * - The stage exposes progress as the CSS variable --p (0 → 1) for overlay copy.
 */
type Props = {
  shot: string;
  frames: number;
  mobileFrames: number;
  /** Tailwind height classes for the tall wrapper, applied only when motion is on, e.g. "[html.motion_&]:h-[300vh]". */
  heightClass: string;
  alt: string;
  /** Horizontal focus for the cover crop on narrow screens (0 = left, 0.5 = centre, 1 = right). */
  focusX?: number;
  /** On portrait screens, the smallest share of the frame's width that must stay visible (0 = plain cover crop). */
  minVisibleW?: number;
  /** Vertical placement when the frame no longer fills the height (0 = top, 1 = bottom). */
  alignY?: number;
  /** Load the poster eagerly (use for a scene on the first screen). */
  eager?: boolean;
  /** Frame (1-based, desktop numbering) shown as the still under reduced motion. */
  still?: number;
  className?: string;
  children?: ReactNode;
};

const pad = (n: number) => String(n).padStart(4, "0");
const src = (shot: string, mobile: boolean, n: number) => `/frames/${shot}${mobile ? "-m" : ""}/f_${pad(n)}.webp`;

export function ScrollFrames({ shot, frames, mobileFrames, heightClass, alt, focusX = 0.5, minVisibleW = 0, alignY = 0.5, still = 1, eager = false, className = "", children }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = wrap.current;
    const st = stage.current;
    const cv = canvas.current;
    if (!root || !st || !cv) return;
    const motion = document.documentElement.classList.contains("motion") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motion) return;

    const mobile = matchMedia("(max-width: 767px)").matches;
    const n = mobile ? mobileFrames : frames;
    const imgs: (HTMLImageElement | null)[] = new Array(n).fill(null);
    const ready: boolean[] = new Array(n).fill(false);
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;
    let disposed = false;
    let raf = 0;
    let last = -1;
    let want = 0;

    const load = (i: number, priority: "high" | "low" | "auto" = "auto") => {
      if (imgs[i] || disposed) return;
      const im = new Image();
      im.decoding = "async";
      (im as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
      im.src = src(shot, mobile, i + 1);
      imgs[i] = im;
      im.decode()
        .catch(() => undefined)
        .then(() => {
          if (disposed || !im.naturalWidth) return;
          ready[i] = true;
          // A frame we were waiting for has arrived: redraw if it is the best one available now.
          if (Math.abs(i - want) <= Math.abs(nearest(want) - want)) schedule(true);
        });
    };
    const nearest = (i: number) => {
      if (ready[i]) return i;
      for (let d = 1; d < n; d++) {
        if (i - d >= 0 && ready[i - d]) return i - d;
        if (i + d < n && ready[i + d]) return i + d;
      }
      return -1;
    };

    // Canvas size follows the stage, at device pixel ratio (capped at 2).
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(st.clientWidth * dpr);
      const h = Math.round(st.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        last = -1;
      }
    };
    const draw = (i: number) => {
      const im = imgs[i];
      if (!im) return;
      const cw = cv.width;
      const ch = cv.height;
      const iw = im.naturalWidth;
      const ih = im.naturalHeight;
      let s = Math.max(cw / iw, ch / ih); // cover
      if (minVisibleW > 0 && cw < ch) s = Math.min(s, cw / (minVisibleW * iw)); // keep the subject in frame on phones
      const dw = iw * s;
      const dh = ih * s;
      const dx = (cw - dw) * focusX;
      const dy = dh < ch ? (ch - dh) * alignY : (ch - dh) / 2;
      if (dh < ch) {
        // Fill above and below by stretching the frame's own top and bottom rows (sky, ground).
        ctx.drawImage(im, 0, 0, iw, 2, dx, 0, dw, Math.ceil(dy) + 1);
        ctx.drawImage(im, 0, ih - 2, iw, 2, dx, Math.floor(dy + dh) - 1, dw, ch - (dy + dh) + 2);
      }
      ctx.drawImage(im, dx, dy, dw, dh);
      if (dh < ch) {
        // Below the frame, fade the stretched ground into the copy scrim so moving cars don't streak.
        const y0 = dy + dh - 48;
        const g = ctx.createLinearGradient(0, y0, 0, Math.min(ch, y0 + 72));
        g.addColorStop(0, "rgba(5,18,34,0)");
        g.addColorStop(1, "rgba(5,18,34,0.94)");
        ctx.fillStyle = g;
        ctx.fillRect(0, y0, cw, ch - y0);
      }
    };
    const progress = () => {
      const r = root.getBoundingClientRect();
      const range = root.offsetHeight - innerHeight;
      return range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
    };
    const tick = (force = false) => {
      raf = 0;
      const p = progress();
      st.style.setProperty("--p", p.toFixed(4));
      want = Math.round(p * (n - 1));
      const i = nearest(want);
      if (i < 0 || (i === last && !force)) return;
      draw(i);
      last = i;
      st.classList.add("is-drawn");
    };
    const schedule = (force = false) => {
      if (force) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => tick(true));
        return;
      }
      if (!raf) raf = requestAnimationFrame(() => tick());
    };
    const onScroll = () => schedule();
    const onResize = () => {
      size();
      schedule(true);
    };

    size();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(st);

    // First 10 frames once the page itself has loaded, at low priority.
    const first = () => {
      for (let i = 0; i < Math.min(10, n); i++) load(i, i === 0 ? "auto" : "low");
    };
    if (eager || document.readyState === "complete") first();
    else addEventListener("load", first, { once: true });

    // The rest when the section comes within ~1.5 screens; a few at a time, in scroll order.
    let started = false;
    const rest = () => {
      if (started) return;
      started = true;
      first();
      let k = 10;
      const pump = () => {
        if (disposed) return;
        let inFlight = 0;
        for (let i = 10; i < k; i++) if (imgs[i] && !ready[i]) inFlight++;
        while (k < n && inFlight < 6) {
          load(k++);
          inFlight++;
        }
        if (k < n) setTimeout(pump, 60);
      };
      pump();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) rest();
      },
      { rootMargin: "150% 0px 150% 0px" },
    );
    io.observe(root);
    schedule(true);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("load", first);
      ro.disconnect();
      io.disconnect();
      imgs.forEach((im) => im && (im.src = ""));
    };
  }, [shot, frames, mobileFrames, focusX, minVisibleW, alignY, eager]);

  // Poster (first frame for motion, `still` frame otherwise) so the stage is never empty.
  const stillM = Math.max(1, Math.round(((still - 1) / Math.max(1, frames - 1)) * (mobileFrames - 1)) + 1);
  return (
    <div ref={wrap} className={`sv-frames relative ${heightClass} ${className}`}>
      <div ref={stage} className="sv-frames-stage">
        <picture>
          <source media="(max-width: 767px)" srcSet={src(shot, true, stillM)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sv-frames-poster" src={src(shot, false, still)} alt={alt} style={{ objectPosition: `${focusX * 100}% 50%` }} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" />
        </picture>
        <canvas ref={canvas} className="sv-frames-canvas" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
