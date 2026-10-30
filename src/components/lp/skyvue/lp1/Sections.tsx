"use client";

import { privacyUrl } from "@/data/lp-paths";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, createDrawable, createTimeline, onScroll, stagger } from "animejs";
import { AnimatePresence, motion } from "motion/react";
import {
  approvals,
  careInsideTheGate,
  comparison,
  delivered,
  faqs,
  locationGuide,
  masterPlans,
  skyvue,
  trackRecord,
  units,
} from "@/data/skyvue-landing";
import { useLp } from "./PageConfig";
import { withStar } from "../Terms";
import { FooterCredit } from "../FooterCredit";
import { BangalorePortfolio, Progress, SiteMap } from "../Proof";
import { Check, Phone, Pin, Plus, WhatsApp } from "@/components/Icons";
import { LeadForm, UNLOCK_EVENT, UNLOCK_KEY } from "../LeadForm";
import { revealOnEnter, useAnime } from "./anim";
import { openEnquiry } from "./EnquiryDrawer";

const wa = (t: string) => `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent(t)}`;

function Head({ eyebrow, title, sub, id, light }: { eyebrow: string; title: string; sub?: string; id: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className="sv-eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 id={id} className={`mt-3 text-[30px] leading-[1.1] sm:text-[44px] ${light ? "text-white" : "text-[var(--sv-ink)]"}`} data-reveal>
        {withStar(title)}
      </h2>
      {sub && (
        <p className={`mt-4 max-w-[60ch] text-[17px] leading-relaxed ${light ? "text-white/70" : "text-[var(--sv-muted)]"}`} data-reveal>
          {withStar(sub)}
        </p>
      )}
    </div>
  );
}

/* ───────────── Building proof · construction progress ───────────── */
export function ProgressBlock() {
  return <Progress tone="light" onCta={() => openEnquiry("progress", "site_visit")} />;
}

/* ───────────── B10 · Compare ───────────── */
export function Compare() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, (root) => {
    revealOnEnter(root);
    animate(root.querySelectorAll<HTMLElement>("[data-bar]"), {
      scaleX: [0, 1],
      duration: 1400,
      delay: stagger(140),
      ease: "outExpo",
      autoplay: onScroll({ target: root.querySelector<HTMLElement>("[data-bars]")!, enter: { target: "top", container: "bottom-=120" }, repeat: false }),
    });
  });
  const homesMax = 2100;
  const [tip, setTip] = useState<string | null>(null);
  const pointer = useRef("");
  // a tap anywhere else closes an open info card (touch screens don't always blur the button)
  useEffect(() => {
    if (!tip) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.(".sv-bar-hit")) setTip(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [tip]);
  /** One bar segment: grows in on scroll; hover (mouse), tap (touch) or focus (keyboard) opens its info card. */
  const bar = (id: string, from: number, to: number, max: number, cls: string, label: string, info: { k: string; v: string; d: string }, align: "start" | "center" | "end") => {
    const open = tip === id;
    return (
      <button
        type="button"
        className={`sv-bar-hit ${open ? "is-open" : ""}`}
        style={{ left: `${(from / max) * 100}%`, width: `${((to - from) / max) * 100}%` }}
        aria-label={label}
        aria-describedby={`tip-${id}`}
        aria-expanded={open}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setTip(id)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setTip((t) => (t === id ? null : t))}
        onFocus={() => !pointer.current && setTip(id)}
        onBlur={() => {
          pointer.current = "";
          setTip((t) => (t === id ? null : t));
        }}
        onClick={() => {
          // mouse: hover already opened it, keep it; touch: tap toggles
          if (pointer.current === "mouse") setTip(id);
          else if (pointer.current) setTip((t) => (t === id ? null : id));
          pointer.current = "";
        }}
        onKeyDown={(e) => e.key === "Escape" && setTip(null)}
      >
        <span data-bar className={`sv-bar-fill ${cls}`} />
        <span role="tooltip" id={`tip-${id}`} className={`sv-bar-tip is-${align}`}>
          <span className="sv-bar-tip-k">{info.k}</span>
          <span className="sv-bar-tip-v sv-tnum">{info.v}</span>
          <span className="sv-bar-tip-d">{info.d}</span>
        </span>
      </button>
    );
  };
  return (
    <section ref={ref} className="sv-section sv-sky" aria-labelledby="compare-title" id="compare">
      <div className="sv-wrap" data-reveal-group>
        <Head
          id="compare-title"
          eyebrow="Compare before you choose"
          title="A smaller community. A larger home."
          sub="Put SkyVue next to the other projects on your shortlist."
        />
        <div data-bars className="mt-12 grid gap-10">
          <div className="rounded-3xl bg-white/80 p-6 sm:p-8" data-reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--sv-muted)]">Homes in the community</p>
              <p className="sv-bar-hint text-[12px] text-[var(--sv-muted)]">
                <span className="sv-bar-hint-i" aria-hidden="true">i</span>
                <span className="sv-hint-mouse">Hover over a bar for details</span>
                <span className="sv-hint-touch">Tap a bar for details</span>
              </p>
            </div>
            <div className="mt-6 grid gap-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">SkyVue</span>
                  <span className="sv-tnum font-semibold text-[var(--sv-orange)]">570</span>
                </div>
                <div className="relative mt-2 h-3 rounded-full bg-[var(--sv-mist)]">{bar("sv", 0, 570, homesMax, "bg-[var(--sv-orange)]", "SkyVue: 570 homes", { k: "SkyVue", v: "570 homes", d: "The whole community. Fewer neighbours at the gate, the pool and the lifts." }, "start")}</div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Other projects nearby</span>
                  <span className="sv-tnum">759 – 2,055</span>
                </div>
                <div className="relative mt-2 h-3 rounded-full bg-[var(--sv-mist)]">
                  {bar("min", 0, 759, homesMax, "bg-[rgba(0,53,93,0.35)]", "Smallest other project nearby: 759 homes", { k: "Smallest other project nearby", v: "759 homes", d: "Even the smallest one is about 1.3× the size of SkyVue." }, "start")}
                  {bar("max", 759, 2055, homesMax, "bg-[var(--sv-navy)]", "Other projects nearby range up to 2,055 homes", { k: "Largest other project nearby", v: "Up to 2,055 homes", d: "This darker stretch is the range from 759 to 2,055 homes, up to 3.6× SkyVue." }, "end")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white/80" data-reveal>
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <tbody>
              {comparison.rows.slice(1).map((r) => (
                <tr key={r.label} className="border-t border-[var(--sv-line)] first:border-t-0">
                  <td className="px-6 py-4 text-[var(--sv-muted)]">{r.label}</td>
                  <td className="px-6 py-4 font-semibold text-[var(--sv-navy)]">SkyVue: {r.skyvue}</td>
                  <td className="px-6 py-4 text-[var(--sv-muted)]">Others: {r.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-[var(--sv-muted)]" data-reveal>
          {comparison.footnote}
        </p>
        <a href={wa("Hi, please send me the SkyVue comparison sheet.")} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-wa mt-8" data-reveal>
          <WhatsApp width={18} height={18} /> Get the named comparison sheet
        </a>
      </div>
    </section>
  );
}

/* ───────────── B6 · Homes & plans ───────────── */
export function Homes() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  useAnime(ref, revealOnEnter);
  useEffect(() => {
    const check = () => {
      try {
        setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
      } catch {}
    };
    check();
    window.addEventListener(UNLOCK_EVENT, check);
    return () => window.removeEventListener(UNLOCK_EVENT, check);
  }, []);
  const [j, setJ] = useState(0);
  const u = units[i];
  const v = u.plans[Math.min(j, u.plans.length - 1)];
  return (
    <section ref={ref} className="sv-section bg-[var(--sv-mist)]" aria-labelledby="homes-title" id="homes">
      <div className="sv-wrap" data-reveal-group>
        <Head
          id="homes-title"
          eyebrow="Homes & floor plans"
          title="Every home is an exclusive 3 BHK."
          sub="2,010 to 2,890 sq ft. East- and west-facing homes, 10′4″ floor to floor, sculpted balconies with 180° views and extended balconies on select floors."
        />
        <div role="tablist" aria-label="Home sizes" className="mt-10 flex flex-wrap gap-2" data-reveal>
          {units.map((x, n) => (
            <button
              key={x.size}
              role="tab"
              aria-selected={n === i}
              onClick={() => {
                setI(n);
                setJ(0);
              }}
              className={`sv-tnum relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${n === i ? "text-white" : "text-[var(--sv-navy)] hover:bg-white"}`}
            >
              {n === i && <motion.span layoutId="sv-size-pill" className="absolute inset-0 rounded-full bg-[var(--sv-navy)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{x.size.toLocaleString("en-IN")} sq ft</span>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start" data-reveal>
          <div className="sv-plan-frame relative overflow-hidden rounded-3xl border border-[var(--sv-line)] bg-white">
            <AnimatePresence mode="wait">
              <motion.div key={v.img} className="absolute inset-0" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <Image
                  src={v.img}
                  alt={`SkyVue unit ${v.unit}, ${v.facing.toLowerCase()} facing, ${u.size.toLocaleString("en-IN")} sq ft floor plan`}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className={`object-contain transition duration-700 ${unlocked ? "" : "scale-105 blur-md"}`}
                />
              </motion.div>
            </AnimatePresence>
            {unlocked ? (
              <a href={v.img} target="_blank" rel="noopener" className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[var(--sv-navy)] shadow-sm">
                Open full size
              </a>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-white/30 p-6 text-center">
                <div>
                  <p className="sv-display text-xl font-light text-[var(--sv-navy)]">See the full floor plan</p>
                  <button type="button" onClick={() => openEnquiry("plans")} className="sv-btn sv-btn-primary mt-3">
                    Unlock floor plans
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="grid content-start gap-5 rounded-3xl bg-white p-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--sv-muted)]">
                {u.plans.length > 1 ? `${u.plans.length} plans in this size · choose a unit` : "Unit"}
              </p>
              <div role="tablist" aria-label={`Units of ${u.size} sq ft`} className="mt-3 flex flex-wrap gap-2">
                {u.plans.map((x, n) => (
                  <button
                    key={x.img}
                    role="tab"
                    aria-selected={x.img === v.img}
                    onClick={() => setJ(n)}
                    className={`sv-tnum rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                      x.img === v.img ? "border-[var(--sv-orange)] bg-[var(--sv-orange)] text-white" : "border-[var(--sv-line)] text-[var(--sv-navy)] hover:border-[var(--sv-navy)]"
                    }`}
                  >
                    {x.unit} · {x.facing}
                  </button>
                ))}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              {[
                ["Home", u.label],
                ["Size", `${u.size.toLocaleString("en-IN")} sq ft`],
                ["Unit", `Tower ${v.tower} · ${v.unit}`],
                ["Facing", v.facing],
              ].map(([k, val]) => (
                <div key={k} className={k === "Home" ? "col-span-2" : ""}>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--sv-muted)]">{k}</dt>
                  <dd className="sv-tnum mt-1 text-lg">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="sv-plan-offer">
              <p className="sv-plan-offer-hook">Book this home with just 5%.</p>
              <p className="sv-plan-offer-body">
                {withStar("Then pay nothing more until your block's structure is complete.* No-cost EMI on bookings till 31 Dec 2026.* Your savings stay with you while your home goes up.")}
              </p>
              <p className="sv-plan-offer-when">Only on bookings made by 31 Dec 2026.</p>
            </div>
            <button type="button" onClick={() => openEnquiry("plans-offer", "payment_schedule")} className="sv-btn sv-btn-primary">
              Get my 5% payment schedule
            </button>
            <p className="text-[12px] text-[var(--sv-muted)]">Typical unit plan from the SkyVue brochure. Furniture is indicative.</p>
          </div>
        </div>
        <h3 className="mt-14 text-xl text-[var(--sv-ink)]" data-reveal>
          Master plan
        </h3>
        <div className="mt-5 grid max-w-2xl grid-cols-2 gap-3" data-reveal>
          {masterPlans.map((m) => (
            <a key={m.title} href={m.img} target="_blank" rel="noopener" className="group block overflow-hidden rounded-2xl bg-white">
              <span className="relative block aspect-[3/4]">
                <Image src={m.img} alt={`SkyVue ${m.title} plan`} fill sizes="(min-width: 768px) 336px, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </span>
              <span className="block px-4 py-3 text-sm font-semibold">{m.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── B9 · Care inside the gate ───────────── */
export function Care() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} className="sv-section bg-white" aria-labelledby="care-title">
      <div className="sv-wrap grid gap-10 lg:grid-cols-2 lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <Head id="care-title" eyebrow="Care inside the gate" title="Everyday care, a lift ride away." sub="For parents, children and pets, without leaving the community." />
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {careInsideTheGate.map((c) => (
              <li key={c} className="flex items-center gap-3 border-b border-[var(--sv-line)] py-3 text-[15px]" data-reveal>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--sv-orange)]/10 text-[var(--sv-orange)]">
                  <Check width={15} height={15} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <figure className="relative aspect-[16/10] max-w-full overflow-hidden rounded-3xl" data-reveal>
          <Image src="/lp/skyvue/fr/senior-garden.webp" alt="Senior citizen garden on the SkyVue podium" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </figure>
      </div>
    </section>
  );
}

/* ───────────── B11 · Tellapur location guide ───────────── */
export function Location() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} className="sv-section bg-[var(--sv-mist)]" aria-labelledby="loc-title" id="location">
      <div className="sv-wrap grid gap-10 lg:grid-cols-2 lg:items-start" data-reveal-group>
        <div className="min-w-0">
          <Head id="loc-title" eyebrow="Location guide · Tellapur" title="Close to work. Next to green." sub={locationGuide.intro} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {locationGuide.groups.map((g) => (
              <div key={g.title} data-reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sv-muted)]">{g.title}</p>
                <ul className="mt-3 space-y-2 text-[15px]">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[var(--sv-orange)]">
                        <Pin width={16} height={16} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a href={wa("Hi, please send me the SkyVue location pin.")} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-ghost mt-8 text-[var(--sv-navy)]" data-reveal>
            <Pin /> Get the location pin
          </a>
        </div>
        <div className="min-w-0" data-reveal>
          <SiteMap aspect="4 / 3" />
        </div>
      </div>
    </section>
  );
}

/* ───────────── B12 · Approvals ───────────── */
export function Approvals() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} className="sv-section bg-white" aria-labelledby="appr-title" id="approvals">
      <div className="sv-wrap" data-reveal-group>
        <Head id="appr-title" eyebrow="Approvals" title="Check every approval before you call us." sub="SkyVue is registered with Telangana RERA. Copies of the approvals below are shared with every buyer." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {approvals.map((a) => (
            <div key={a.label} className="relative overflow-hidden rounded-2xl border border-[var(--sv-line)] bg-[var(--sv-paper)] p-5" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lp/skyvue/brand/pillar-of-trust.svg" alt="" aria-hidden="true" className="absolute right-4 top-4 h-8 w-auto opacity-80" />
              <p className="pr-8 text-[11px] uppercase tracking-[0.16em] text-[var(--sv-muted)]">{a.label}</p>
              <p className={`mt-3 text-lg ${a.value ? "font-semibold text-[var(--sv-navy)]" : "text-[var(--sv-muted)]"}`}>{a.value ?? "Shared on request"}</p>
              {a.note && (
                <a href={skyvue.reraUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-[var(--sv-orange)] underline">
                  {a.note}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── B13 · Who is Vaishno ───────────── */
export function Builder() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, (root) => {
    revealOnEnter(root);
    animate(root.querySelectorAll<HTMLElement>("[data-tiles] li"), {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 900,
      delay: stagger(70, { from: "center" }),
      ease: "outBack",
      autoplay: onScroll({ target: root.querySelector<HTMLElement>("[data-tiles]")!, enter: { target: "top", container: "bottom-=100" }, repeat: false }),
    });
  });
  return (
    <section ref={ref} className="sv-section bg-[var(--sv-navy-2)] text-white" aria-labelledby="builder-title" id="builder">
      <div className="sv-wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lp/skyvue/brand/pillar-of-trust-on-dark.svg" alt="" aria-hidden="true" className="mb-6 h-14 w-auto" data-reveal />
          <Head light id="builder-title" eyebrow="Who is Vaishno?" title={`${trackRecord.families} families in homes we've delivered.`} sub={`Vaishno Ventures has ${trackRecord.projectsLine}. SkyVue brings the same team to Tellapur, registered with Telangana RERA (${skyvue.rera}).`} />
          <div data-tiles className="mt-8">
            <BangalorePortfolio tone="dark" />
          </div>
        </div>
        <figure className="min-w-0" data-reveal>
          <video
            className="aspect-video w-full rounded-2xl bg-black object-cover"
            src="/lp/skyvue/vaishno-bangalore-construction-drone.mp4"
            poster="/lp/skyvue/vaishno-bangalore-construction-drone-poster.jpg"
            controls
            muted
            playsInline
            preload="none"
          />
          <figcaption className="mt-3 text-xs text-white/55">Vaishno Ventures projects in Bangalore, filmed by drone.</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ───────────── B7 · Payment plan ───────────── */
export function PaymentPlan() {
  const ref = useRef<HTMLElement>(null);
  useAnime(ref, (root) => {
    revealOnEnter(root);
    const path = root.querySelector<SVGPathElement>("[data-plan-path]");
    if (path) {
      createTimeline({
        autoplay: onScroll({ target: root.querySelector<HTMLElement>("[data-plan]")!, enter: { target: "top", container: "bottom-=60" }, leave: { target: "bottom", container: "center" }, sync: 0.3 }),
      })
        .add(createDrawable(path), { draw: ["0 0", "0 1"], duration: 1000, ease: "linear" }, 0)
        .add(root.querySelectorAll<HTMLElement>("[data-step]"), { opacity: [0.25, 1], translateY: [16, 0], duration: 160, delay: stagger(270) }, 40);
    }
  });
  const steps = [
    { t: "Book with 5%", d: "Choose your home and book it with 5%." },
    { t: "Pay nothing more", d: "Until the structure of your block is complete." },
    { t: "No-cost EMI", d: "On bookings till 31 Dec 2026, as per the payment schedule." },
    { t: "Possession", d: `Planned for ${skyvue.possession}.` },
  ];
  return (
    <section ref={ref} className="sv-section bg-[var(--sv-navy)] text-white" aria-labelledby="plan-title" id="payment-plan">
      <div className="sv-wrap" data-reveal-group>
        <Head light id="plan-title" eyebrow={`Offer · bookings till ${skyvue.offer.validTill}`} title="Pay 5%. Then nothing more until your block's structure is complete.*" sub="No-cost EMI on bookings till 31 Dec 2026.* Ask for the full payment schedule for the size you like." />
        <div data-plan className="relative mt-12">
          <svg className="absolute left-0 right-0 top-[18px] hidden h-2 w-full md:block" viewBox="0 0 1000 8" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 12 4 L 988 4" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
            <path data-plan-path d="M 12 4 L 988 4" stroke="var(--sv-orange)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className="relative grid gap-6 md:grid-cols-4">
            {steps.map((s, n) => (
              <li key={s.t} data-step className="md:pr-6">
                <span className="sv-display sv-tnum grid h-10 w-10 place-items-center rounded-full bg-[var(--sv-orange)] text-lg font-light">{n + 1}</span>
                <p className="mt-4 text-lg font-semibold">{s.t}</p>
                <p className="mt-1 text-[14px] text-white/65">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12 grid gap-4 rounded-2xl p-6 ring-1 ring-white/15 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8" data-reveal>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-white/60">Homes starting from</span>
            <span className="sv-display mt-1 block text-[40px] font-light leading-none text-[var(--sv-orange)]">{skyvue.priceFrom}</span>
          </p>
          <p className="text-[14px] leading-relaxed text-white/70">
            Exclusive 3 BHK homes from 2,010 to 2,890 sq ft. Your cost sheet shows the exact 5% booking amount for the home you choose. Offer on bookings till {skyvue.offer.validTill}.
            <a href="#terms" className="ml-1 underline underline-offset-2">
              *Conditions apply
            </a>
          </p>
        </div>
        <button type="button" onClick={() => openEnquiry("payment-plan")} className="sv-btn sv-btn-primary mt-8" data-reveal>
          Get my payment schedule
        </button>
      </div>
    </section>
  );
}

/* ───────────── B14 · FAQ ───────────── */
export function Faq({ items = faqs }: { items?: readonly { q: string; a: string }[] } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  useAnime(ref, revealOnEnter);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section ref={ref} className="sv-section bg-white" aria-labelledby="faq-title" id="faq">
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" data-reveal-group>
        <Head id="faq-title" eyebrow="FAQ" title="Questions buyers ask us first." />
        <div className="border-t border-[var(--sv-line)]">
          {items.map((f, n) => {
            const isOpen = open === n;
            return (
              <div key={f.q} className="border-b border-[var(--sv-line)]" data-reveal>
                <h3 className="!font-sans">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : n)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-[var(--sv-ink)]"
                  >
                    {f.q}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--sv-line)] text-[var(--sv-orange)]">
                      <Plus />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="max-w-[62ch] pb-5 leading-relaxed text-[var(--sv-muted)]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Answers stay in the HTML for search engines and readers without JS. */}
                {!isOpen && <p className="sr-only">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

/* ───────────── Inline enquiry + site visit ───────────── */
export function Enquire() {
  const ref = useRef<HTMLElement>(null);
  const lp = useLp();
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} id="enquire" className="sv-section sv-sky" aria-labelledby="enq-title">
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <Head id="enq-title" eyebrow="Floor plans · cost sheet · RERA" title="Everything you need to decide, on WhatsApp." sub="Share your number and get the floor plans for your size, the cost sheet and the RERA certificate. A SkyVue advisor then calls to answer your questions." />
          <ul className="mt-8 grid gap-2 text-[15px]">
            {["Floor plans for the size you pick", "Cost sheet with the 5% plan", "RERA certificate and location pin", "Weekday and weekend site visits"].map((t) => (
              <li key={t} className="flex items-center gap-3" data-reveal>
                <span className="text-[var(--sv-orange)]">
                  <Check width={16} height={16} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <LeadForm pageId={lp.id} pageSlug={lp.slug} formId={`${lp.id}-inline`} title={lp.formTitle} cta={lp.formCta} intent={lp.intent} />
        </div>
      </div>
    </section>
  );
}

export function Visit() {
  const ref = useRef<HTMLElement>(null);
  const lp = useLp();
  useAnime(ref, revealOnEnter);
  return (
    <section ref={ref} id="visit" className="relative isolate overflow-hidden bg-[#001b36] py-20 text-white sm:py-28" aria-labelledby="visit-title">
      <Image src={lp.images?.visit ?? "/lp/skyvue/fr/pool.webp"} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#001b36]/90 via-[#001b36]/60 to-transparent" />
      <div className="sv-wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center" data-reveal-group>
        <div className="min-w-0">
          <Head light id="visit-title" eyebrow="Site visit" title="See SkyVue for yourself. Bring the family." sub="Pick a weekday or weekend slot. Our team confirms it on WhatsApp and walks you through the site, the plans and the cost sheet." />
          <div className="mt-8 flex flex-wrap gap-3" data-reveal>
            <a href={`tel:${skyvue.phone}`} className="sv-btn sv-btn-ghost">
              <Phone /> {skyvue.phoneLabel}
            </a>
            <a href={wa("Hi, I'd like to book a SkyVue site visit.")} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-wa">
              <WhatsApp width={18} height={18} /> WhatsApp us
            </a>
          </div>
          <p className="sv-display mt-12 text-[13px] uppercase tracking-[0.4em] text-white/60" data-reveal>
            Chaos to Calm
          </p>
        </div>
        <div data-reveal>
          <LeadForm pageId={lp.id} pageSlug={lp.slug} formId={`${lp.id}-visit`} title="Book a site visit" cta="Book my visit" intent="site_visit" tone="dark" />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#001b36] pb-36 pt-12 text-white/60 md:pb-24">
      <div className="sv-wrap grid gap-8 text-sm md:grid-cols-[auto_1fr] md:items-start">
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lp/skyvue/brand/skyvue-logo-on-dark.svg" alt="Vaishno SkyVue" className="h-12 w-auto" />
        </div>
        <div className="space-y-3 text-xs leading-relaxed">
          <p>
            <strong className="text-white">Vaishno SkyVue</strong>, Tellapur, Hyderabad · TS RERA {skyvue.rera} · A project by Vaishno Ventures, 1st Floor, Splendor Towers, Plot No. 122 &amp; 123,
            Doyens Lakeside Township, Serilingampally, Hyderabad, Telangana 500019.
          </p>
          <p>
            Disclaimer: All images are artist&apos;s impressions and for representation only. Specifications, amenities, plans and prices are indicative and subject to change as per approvals.
            Prices shown are base prices; GST, parking and other charges are extra. This page is not an offer or a contract.
          </p>
          <p id="terms" className="sv-terms scroll-mt-28 text-white/75">
            {skyvue.offer.terms}
          </p>
          <p>
            <Link href={privacyUrl} className="underline">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
      <div className="sv-wrap">
        <FooterCredit />
      </div>
    </footer>
  );
}

