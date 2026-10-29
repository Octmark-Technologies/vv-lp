"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";
import { lp1Angle } from "@/data/skyvue-lp1";
import { motionOn, seg } from "./anim";
import { openEnquiry } from "./EnquiryDrawer";

function draw(canvas: HTMLCanvasElement, cols: number, total: number, shown: number, mark: number, color: string, faint: string) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  if (!w) return;
  const rows = Math.ceil(total / cols);
  const step = w / cols;
  const h = rows * step;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const r = Math.max(1.3, step * 0.32);
  for (let i = 0; i < total; i++) {
    const x = (i % cols) * step + step / 2;
    const y = h - (Math.floor(i / cols) * step + step / 2); // fill from the bottom, like floors
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = i < shown ? (i < mark ? color : faint) : "rgba(0,53,93,0.06)";
    ctx.fill();
  }
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
/** "570" → 570 / "", "75%" → 75 / "%", "2 lakh" → 2 / " lakh" */
const split = (v: string) => {
  const m = v.match(/^([\d,]+)(.*)$/);
  return m ? { n: Number(m[1].replace(/,/g, "")), rest: m[2] } : { n: 0, rest: v };
};

/**
 * B5 · "Why 570 matters", told entirely by the scroll (anime.js onScroll, synced both ways).
 *
 * Desktop (≥1000 px wide, ≥640 px tall): the section holds while you scroll, one idea per beat:
 *   1. "A township is a city." + the context line
 *   2. the township field fills, one dot per home, counting to 2,055 (darker dots = the smallest, 759)
 *   3. "570 homes is a neighbourhood." + SkyVue's 570 fill in orange, counting to 570
 *   4. the four facts land one by one, their rules drawing and numbers counting
 *   5. the call to action
 * Phones / short screens: no hold; each part plays as it passes through the screen.
 * Reduced motion / no JS: everything is shown complete. Numbers are always real text.
 */
export function Neighbourhood() {
  const ref = useRef<HTMLElement>(null);
  const a = useRef<HTMLCanvasElement>(null);
  const b = useRef<HTMLCanvasElement>(null);
  const { townshipMin, townshipMax } = lp1Angle;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const last = { a: 1, b: 1 };
    const paintA = (p: number) => {
      last.a = p;
      if (a.current) draw(a.current, 15, 570, Math.round(570 * p), 570, "#F95300", "#F95300");
    };
    const paintB = (p: number) => {
      last.b = p;
      if (b.current) draw(b.current, 45, townshipMax, Math.round(townshipMax * p), townshipMin, "rgba(0,53,93,0.55)", "rgba(0,53,93,0.22)");
    };
    const onResize = () => {
      paintA(last.a);
      paintB(last.b);
    };
    addEventListener("resize", onResize);

    if (!motionOn()) {
      paintA(1);
      paintB(1);
      return () => removeEventListener("resize", onResize);
    }

    const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s);
    const qa = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
    const lift = (el: HTMLElement | null, k: number, dist = 28, floor = 0) => {
      if (!el) return;
      el.style.opacity = (floor + (1 - floor) * k).toFixed(3);
      el.style.transform = `translate3d(0,${((1 - ease(k)) * dist).toFixed(1)}px,0)`;
    };
    const countA = q("[data-count-a]");
    const countB = q("[data-count-b]");
    const minB = q("[data-min-b]");
    const stats = qa("[data-stat]");

    const setTownship = (k: number) => {
      paintB(ease(k));
      if (countB) countB.textContent = fmt(townshipMax * ease(k));
      // "759–" joins the label once the field is full, so the count reads 0 → 2,055 first.
      if (minB) {
        minB.style.display = k < 0.9 ? "none" : "";
        minB.style.opacity = seg(k, 0.9, 1).toFixed(3);
      }
    };
    const setSkyvue = (k: number) => {
      paintA(ease(k));
      if (countA) countA.textContent = fmt(570 * ease(k));
    };
    const setStat = (el: HTMLElement, k: number) => {
      lift(el, k, 22);
      el.style.setProperty("--rule", ease(k).toFixed(3));
      const v = el.querySelector<HTMLElement>("[data-stat-val]");
      if (v) {
        const { n, rest } = split(v.dataset.value ?? "");
        v.textContent = n >= 10 ? `${fmt(n * ease(seg(k, 0.15, 1)))}${rest}` : v.dataset.value ?? "";
      }
    };

    const pinned = matchMedia("(min-width: 1000px) and (min-height: 640px)").matches;
    const anims: { revert: () => void }[] = [];

    if (pinned) {
      root.classList.add("is-pinned");
      // p: 0 when the section's top meets the screen's bottom, 1 when its bottom meets the screen's bottom.
      // The first ~25% is the section arriving; the hold starts at ~0.27.
      const update = (p: number) => {
        lift(q("[data-eyebrow]"), seg(p, 0.06, 0.16));
        lift(q("[data-h1]"), seg(p, 0.09, 0.2), 36);
        lift(q("[data-body]"), seg(p, 0.15, 0.26));
        lift(q("[data-fig-b]"), seg(p, 0.18, 0.28), 30);
        setTownship(seg(p, 0.28, 0.5));
        lift(q("[data-h2]"), seg(p, 0.48, 0.56), 24, 0.14);
        lift(q("[data-fig-a]"), seg(p, 0.48, 0.54), 30);
        setSkyvue(seg(p, 0.52, 0.66));
        stats.forEach((el, i) => setStat(el, seg(p, 0.66 + i * 0.055, 0.66 + i * 0.055 + 0.08)));
        lift(q("[data-cta]"), seg(p, 0.9, 0.97));
      };
      update(0);
      anims.push(
        animate(
          { t: 0 },
          {
            t: [0, 1],
            ease: "linear",
            duration: 1000,
            autoplay: onScroll({ target: root, enter: "bottom top", leave: "bottom bottom", sync: 0.25, onUpdate: (self) => update(self.progress) }),
          },
        ),
      );
    } else {
      // Phones / short screens: every text block slides in once and then stays fully readable (no half-faded text
      // while reading). The stats count up once. The dot comparison is its own pinned scene (HoodMobileChart).
      const once = (el: HTMLElement | null, onDone?: () => void, onTick?: (k: number) => void) => {
        if (!el) return;
        lift(el, 0, 20);
        const st = { k: 0 };
        anims.push(
          animate(st, {
            k: [0, 1],
            duration: 700,
            ease: "outCubic",
            onUpdate: () => {
              lift(el, st.k, 20);
              onTick?.(st.k);
            },
            onComplete: () => onDone?.(),
            autoplay: onScroll({ target: el, enter: "bottom-=12% top", repeat: false }),
          }),
        );
      };
      ["[data-eyebrow]", "[data-h1]", "[data-h2]", "[data-body]", "[data-cta]"].forEach((sel) => once(q(sel)));
      stats.forEach((el) => {
        setStat(el, 0);
        el.style.opacity = "0";
        once(el, undefined, (k) => setStat(el, k));
      });
      paintA(1);
      paintB(1);
    }

    return () => {
      removeEventListener("resize", onResize);
      anims.forEach((x) => x.revert());
      root.classList.remove("is-pinned");
      root.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
        if (el.tagName !== "CANVAS") el.removeAttribute("style");
      });
    };
  }, [townshipMin, townshipMax]);

  const [line1, line2] = lp1Angle.title.split(/(?<=\.)\s+/);
  return (
    <section ref={ref} className="sv-hood sv-pin bg-white" style={{ ["--pin" as string]: "240svh" }} aria-labelledby="hood-title">
      <div className="sv-stage sv-hood-stage">
        <div className="sv-wrap sv-hood-wrap">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="min-w-0">
              <p className="sv-eyebrow" data-eyebrow>
                {lp1Angle.eyebrow}
              </p>
              <h2 id="hood-title" className="mt-3 text-[30px] leading-[1.1] text-[var(--sv-ink)] sm:text-[46px]">
                <span className="block" data-h1>
                  {line1}
                </span>{" "}
                <span className="block" data-h2>
                  {line2}
                </span>
              </h2>
              <p className="sv-hood-body mt-5 max-w-[56ch] text-[17px] leading-relaxed text-[var(--sv-muted)]" data-body>
                {lp1Angle.body}
              </p>
              <HoodMobileChart min={townshipMin} max={townshipMax} />
              <dl className="sv-hood-stats mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
                {lp1Angle.points.map((pt) => (
                  <div key={pt.label} className="sv-hood-stat flex flex-col pt-4" data-stat>
                    <dt className="text-[13px] font-semibold text-[var(--sv-ink)]">{pt.label}</dt>
                    <dd className="sv-display sv-tnum order-first mt-1 text-[38px] font-light leading-none text-[var(--sv-navy)]" data-stat-val data-value={pt.value}>
                      {pt.value}
                    </dd>
                    <dd className="mt-1 text-[13px] text-[var(--sv-muted)]">{pt.text}</dd>
                  </div>
                ))}
              </dl>
              <div data-cta className="mt-10">
                <button type="button" onClick={() => openEnquiry("neighbourhood")} className="sv-btn sv-btn-primary">
                  Get floor plans & cost sheet
                </button>
              </div>
            </div>

            <figure className="sv-hood-fig min-w-0" data-fig aria-label="One dot per home: SkyVue 570 homes against 759 to 2,055 homes at other projects nearby">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] items-end gap-6">
                <div className="min-w-0" data-fig-a>
                  <canvas ref={a} className="block w-full" aria-hidden="true" />
                  <p className="mt-3 text-[13px] font-semibold text-[var(--sv-orange)]">SkyVue</p>
                  <p className="sv-display sv-tnum whitespace-nowrap text-[clamp(20px,1.9vw,28px)] font-light leading-none">
                    <span data-count-a>570</span> homes
                  </p>
                </div>
                <div className="min-w-0" data-fig-b>
                  <canvas ref={b} className="block w-full" aria-hidden="true" />
                  <p className="mt-3 text-[13px] font-semibold text-[var(--sv-navy)]">Other projects nearby</p>
                  <p className="sv-display sv-tnum text-[28px] font-light leading-none">
                    <span data-min-b>{townshipMin.toLocaleString("en-IN")}–</span>
                    <span data-count-b>{townshipMax.toLocaleString("en-IN")}</span> homes
                  </p>
                </div>
              </div>
              <figcaption className="mt-5 text-[12px] text-[var(--sv-muted)]">
                One dot per home. Darker dots on the right mark the smallest of those projects ({townshipMin.toLocaleString("en-IN")} homes); the full field is the largest ({townshipMax.toLocaleString("en-IN")}). Public sources, October 2026.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Phones / short screens · the 570-vs-township comparison as one pinned scene, at one scale.
 * One full-width field of 2,055 dots (one per home in the largest other project nearby):
 *   1. the field fills, counting to 2,055 ("A township nearby")
 *   2. it dims and SkyVue's 570 fill in orange inside the same field ("570 homes is a neighbourhood")
 *   3. the summary: SkyVue 570 vs other projects nearby 759–2,055
 * Reduced motion / no JS: the final frame, not pinned.
 */
function HoodMobileChart({ min, max }: { min: number; max: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const unit = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const chips = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrap.current;
    const c = cv.current;
    if (!root || !c) return;
    const motion = motionOn();
    let raf = 0;
    let lastKey = "";

    const paint = (n1: number, dim: number, n2: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const box = c.parentElement!;
      const w = box.clientWidth;
      const hAvail = Math.max(160, box.clientHeight);
      // Columns so the whole field fits the space left on screen.
      let cols = Math.max(28, Math.ceil(Math.sqrt((max * w) / hAvail)));
      let step = w / cols;
      while (Math.ceil(max / cols) * step > hAvail && cols < 80) {
        cols++;
        step = w / cols;
      }
      const rows = Math.ceil(max / cols);
      const h = rows * step;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        c.style.height = `${h}px`;
      }
      const ctx = c.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const r = Math.max(1.4, step * 0.34);
      const k = 1 - 0.7 * dim;
      for (let i = 0; i < max; i++) {
        const x = (i % cols) * step + step / 2;
        const y = h - (Math.floor(i / cols) * step + step / 2);
        let fill = "rgba(0,53,93,0.07)";
        if (i < n2) fill = "#F95300";
        else if (i < n1) fill = i < min ? `rgba(0,53,93,${(0.62 * k).toFixed(3)})` : `rgba(0,53,93,${(0.3 * k).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
      }
    };

    const setText = (stage: 0 | 1, n: number) => {
      if (label.current) label.current.textContent = stage === 0 ? "A township nearby" : "SkyVue";
      if (count.current) {
        count.current.textContent = fmt(n);
        count.current.style.color = stage === 0 ? "var(--sv-navy)" : "var(--sv-orange)";
      }
      if (unit.current) unit.current.textContent = " homes";
      if (line.current) line.current.textContent = stage === 0 ? "A township is a city." : "570 homes is a neighbourhood.";
    };

    const final = () => {
      setText(1, 570);
      paint(max, 1, 570);
      if (chips.current) chips.current.style.opacity = "1";
    };

    if (!motion) {
      final();
      const onR = () => paint(max, 1, 570);
      addEventListener("resize", onR);
      return () => removeEventListener("resize", onR);
    }

    const tick = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const range = root.offsetHeight - innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      const n1 = Math.round(max * ease(seg(p, 0.04, 0.38)));
      const dim = seg(p, 0.42, 0.54);
      const n2 = Math.round(570 * ease(seg(p, 0.5, 0.8)));
      const stage = p < 0.46 ? 0 : 1;
      const key = `${n1}|${dim.toFixed(2)}|${n2}|${c.parentElement!.clientWidth}`;
      if (key !== lastKey) {
        paint(n1, dim, n2);
        lastKey = key;
      }
      setText(stage as 0 | 1, stage === 0 ? n1 : n2);
      if (chips.current) {
        const o = seg(p, 0.82, 0.93);
        chips.current.style.opacity = o.toFixed(3);
        chips.current.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      lastKey = "";
      on();
    };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", onResize);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", onResize);
    };
  }, [min, max]);

  return (
    <div ref={wrap} className="sv-hood-m" aria-label={`One dot per home: SkyVue ${570} homes against ${min.toLocaleString("en-IN")} to ${max.toLocaleString("en-IN")} homes at other projects nearby`} role="img">
      <div className="sv-hood-m-stage">
        <div className="sv-hood-m-head">
          <p ref={label} className="sv-eyebrow">A township nearby</p>
          <p className="sv-display sv-tnum mt-1 text-[40px] font-light leading-none">
            <span ref={count} style={{ color: "var(--sv-navy)" }}>0</span>
            <span ref={unit} className="text-[22px] text-[var(--sv-ink)]"> homes</span>
          </p>
          <p ref={line} className="mt-2 text-[17px] text-[var(--sv-ink)]">A township is a city.</p>
        </div>
        <div className="sv-hood-m-field">
          <canvas ref={cv} className="block w-full" aria-hidden="true" />
        </div>
        <div ref={chips} className="sv-hood-m-chips" style={{ opacity: 0 }}>
          <span className="sv-hood-m-chip is-sv">
            <b className="sv-tnum">570</b> SkyVue
          </span>
          <span className="sv-hood-m-chip">
            <b className="sv-tnum">
              {min.toLocaleString("en-IN")}–{max.toLocaleString("en-IN")}
            </b>{" "}
            other projects nearby
          </span>
        </div>
      </div>
    </div>
  );
}
