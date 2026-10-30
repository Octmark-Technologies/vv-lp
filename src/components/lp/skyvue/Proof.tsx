"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { skyvue } from "@/data/skyvue-landing";
import "./proof.css";

/* ───────────────────────── Construction progress (building proof) ───────────────────────── */

/** Monthly site updates, oldest → newest: 14-second clips cut from Vaishno's drone progress videos. */
const months = [
  { id: "2026-06", short: "Jun", label: "June 2026", stage: "Foundation", line: "Raft shuttering completed for Block A; lift cores marked out." },
  { id: "2026-07", short: "Jul", label: "July 2026", stage: "Footings", line: "Block A footings completed; columns and retaining walls rising." },
  { id: "2026-08", short: "Aug", label: "August 2026", stage: "Columns", line: "Block A columns completed; B2 roof-slab shuttering 60% done." },
  { id: "2026-10", short: "Oct", label: "October 2026", stage: "B1 slab", line: "Block A B1 slab completed; Block B podium slabs in progress." },
] as const;

/** Site photos, 27 Oct 2026. */
const photos = [
  { src: "/progress/site-1.webp", cap: "Block A rising, aerial" },
  { src: "/progress/site-5.webp", cap: "Block A podium and tower crane" },
  { src: "/progress/site-3.webp", cap: "B1 slab completed, top-down" },
  { src: "/progress/site-4.webp", cap: "Block B slab and columns" },
  { src: "/progress/site-2.webp", cap: "Clubhouse excavation" },
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

/** The month's clip: poster first, plays only when tapped (no autoplay), muted with controls. */
function MonthPlayer({ m }: { m: (typeof months)[number] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setPlaying(false), [m.id]);
  const play = () => {
    const v = ref.current;
    if (!v) return;
    setPlaying(true);
    v.play().catch(() => setPlaying(false));
  };
  return (
    <figure className="sv-pg-player">
      <video
        ref={ref}
        key={m.id}
        src={`/progress/${m.id}.mp4`}
        poster={`/progress/${m.id}.webp`}
        muted
        playsInline
        preload="none"
        controls={playing}
        onPause={(e) => e.currentTarget.ended && setPlaying(false)}
        aria-label={`SkyVue construction progress, ${m.label}`}
      />
      {!playing && (
        <button type="button" className="sv-pg-play" onClick={play} aria-label={`Play the ${m.label} drone update`}>
          <span className="sv-pg-play-dot">
            <PlayIcon />
          </span>
          <span className="sv-pg-play-txt">Watch the {m.label} update</span>
        </button>
      )}
      <figcaption className="sv-pg-cap">
        <span className="sv-pg-badge">{m.stage}</span>
        <span>{m.line}</span>
      </figcaption>
    </figure>
  );
}

/** Full-screen photo viewer: Esc closes, ←/→ step, focus returns to the thumbnail. */
function PhotoViewer({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    addEventListener("keydown", key);
    const o = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", key);
      document.documentElement.style.overflow = o;
    };
  }, [onClose, onStep]);
  const p = photos[index];
  return (
    <div className="sv-pg-viewer" role="dialog" aria-modal="true" aria-label={`Site photo ${index + 1} of ${photos.length}`} onClick={onClose}>
      <div className="sv-pg-viewer-in" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.src} alt={`${p.cap}, SkyVue site, 27 Oct 2026`} />
        <div className="sv-pg-viewer-bar">
          <span className="sv-tnum">
            {index + 1} / {photos.length} · {p.cap}
          </span>
          <span className="sv-pg-viewer-nav">
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo">
              ‹
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="Next photo">
              ›
            </button>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo">
              ✕
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export function Progress({ tone = "light", onCta, ctaHref }: { tone?: "light" | "dark"; onCta?: () => void; ctaHref?: string }) {
  const [m, setM] = useState(months.length - 1); // newest first
  const [photo, setPhoto] = useState<number | null>(null);
  const lastThumb = useRef<HTMLButtonElement | null>(null);
  const cur = months[m];
  const wa = `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent("Hi, please send me the latest SkyVue construction progress video.")}`;
  const close = () => {
    setPhoto(null);
    lastThumb.current?.focus();
  };
  const step = (d: number) => setPhoto((i) => (i === null ? i : (i + d + photos.length) % photos.length));

  return (
    <section className={`sv-pg sv-pg-${tone}`} aria-labelledby="proof-title" id="progress">
      <div className="sv-pg-wrap">
        <header className="sv-pg-head">
          <div>
            <p className="sv-pg-eyebrow">
              <span className="sv-pg-live" aria-hidden="true" /> Construction progress · updated monthly
            </p>
            <h2 id="proof-title" className="sv-pg-title">
              Don&apos;t take our word for it. Watch it rise.
            </h2>
          </div>
          <dl className="sv-pg-facts">
            <div>
              <dt>Last site visit</dt>
              <dd>27 Oct 2026</dd>
            </div>
            <div>
              <dt>Drone updates</dt>
              <dd className="sv-tnum">{months.length} months</dd>
            </div>
            <div>
              <dt>TS RERA</dt>
              <dd className="sv-tnum">{skyvue.rera}</dd>
            </div>
          </dl>
        </header>

        {/* Timeline: oldest → newest, the rail fills up to the month on screen */}
        <div className="sv-pg-rail" role="tablist" aria-label="Progress by month" style={{ ["--fill" as string]: String(m / (months.length - 1)) }}>
          {months.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={i === m}
              aria-controls="sv-pg-panel"
              className={`sv-pg-step ${i === m ? "is-on" : ""} ${i < m ? "is-done" : ""}`}
              onClick={() => setM(i)}
            >
              <span className="sv-pg-dot" aria-hidden="true" />
              <span className="sv-pg-step-m">
                {x.short} <span className="sv-tnum">2026</span>
                {i === months.length - 1 && <em>Latest</em>}
              </span>
              <span className="sv-pg-step-s">{x.stage}</span>
            </button>
          ))}
        </div>

        <div id="sv-pg-panel" role="tabpanel" aria-label={cur.label}>
          <MonthPlayer m={cur} />
        </div>

        <div className="sv-pg-photos-head">
          <p className="sv-pg-k">On site · 27 Oct 2026</p>
          <p className="sv-pg-hint">Tap a photo to enlarge</p>
        </div>
        <ul className="sv-pg-photos">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={(e) => {
                  lastThumb.current = e.currentTarget;
                  setPhoto(i);
                }}
                aria-label={`Enlarge photo: ${p.cap}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" loading="lazy" decoding="async" width={1600} height={1200} />
                <span className="sv-pg-photo-cap">{p.cap}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sv-pg-cta">
          <div>
            <p className="sv-pg-cta-t">See it with your own eyes.</p>
            <p className="sv-pg-cta-s">Visit the site, or get each month&apos;s drone update on WhatsApp.</p>
          </div>
          <div className="sv-pg-cta-btns">
            {onCta ? (
              <button type="button" className="sv-pg-btn is-primary" onClick={onCta}>
                Book a site visit
              </button>
            ) : ctaHref ? (
              <a className="sv-pg-btn is-primary" href={ctaHref}>
                Book a site visit
              </a>
            ) : null}
            <a className="sv-pg-btn is-wa" href={wa} target="_blank" rel="noopener noreferrer">
              Monthly updates on WhatsApp
            </a>
          </div>
        </div>
      </div>
      {photo !== null && <PhotoViewer index={photo} onClose={close} onStep={step} />}
    </section>
  );
}

/* ───────────────────────── Google map (responsive, size configurable) ───────────────────────── */

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4604.229472679252!2d78.25902807516621!3d17.44557978345162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbed51aef372d9%3A0xb34f91405d36ad6a!2sVaishno%20Skyvue!5e1!3m2!1sen!2sin!4v1793292563966!5m2!1sen!2sin";

/**
 * The Vaishno SkyVue Google Maps pin. Width fills its column; height is set with `height`
 * (any CSS length) or `aspect` (e.g. "4 / 3"). Loads lazily.
 */
export function SiteMap({ height, aspect = "4 / 3", maxWidth = "100%", className = "" }: { height?: string; aspect?: string; maxWidth?: string; className?: string }) {
  return (
    <div className={`sv-map ${className}`} style={{ maxWidth, ...(height ? { height } : { aspectRatio: aspect }) }}>
      <iframe
        src={MAP_SRC}
        title="Vaishno SkyVue on Google Maps"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

/* ───────────────────────── Vaishno in Bangalore (portfolio) ───────────────────────── */

const blr = projects.filter((p) => p.city === "Bengaluru");
const blrDelivered = blr.filter((p) => p.status === "completed");
const blrOngoing = blr.filter((p) => p.status === "ongoing");
export const blrDeliveredHomes = blrDelivered.reduce((s, p) => s + p.units, 0);

/** Cards for every Vaishno Ventures project in Bangalore (vaishnoventures.com): ongoing first, then delivered. */
export function BangalorePortfolio({ tone = "dark" }: { tone?: "light" | "dark" }) {
  return (
    <div className={`sv-port sv-port-${tone}`}>
      <div className="sv-port-head">
        <p>
          <strong className="sv-tnum">{blrDelivered.length}</strong> projects delivered in Bangalore
        </p>
        <p>
          <strong className="sv-tnum">{blrDeliveredHomes.toLocaleString("en-IN")}</strong> homes handed over
        </p>
        <p>
          <strong className="sv-tnum">{blrOngoing.length}</strong> under construction
        </p>
      </div>
      <ul className="sv-port-list">
        {[...blrOngoing, ...blrDelivered].map((p) => (
          <li key={p.slug}>
            <span className={`sv-port-tag ${p.status === "completed" ? "is-done" : "is-on"}`}>{p.status === "completed" ? "Delivered" : "Ongoing"}</span>
            <span className="sv-port-name">{p.name.replace("Vaishno ", "")}</span>
            <span className="sv-port-meta">{p.locality}</span>
            <span className="sv-port-meta sv-tnum">
              {p.units} {p.type === "Villas" ? "villas" : "homes"} · {p.acres} acres
              {p.configurations ? ` · ${p.configurations}` : ""}
            </span>
          </li>
        ))}
      </ul>
      <p className="sv-port-src">Source: vaishnoventures.com.</p>
    </div>
  );
}
