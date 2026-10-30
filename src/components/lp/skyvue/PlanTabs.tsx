"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { skyvue, units } from "@/data/skyvue-landing";
import { withStar } from "./Terms";
import { UNLOCK_EVENT, UNLOCK_KEY } from "./LeadForm";

/**
 * Unit plans by size, then by unit (each plan cut from the brochure, pp. 51–61).
 * Plans stay blurred until the visitor submits a form (floor plans are the lead magnet).
 * Unlock is remembered.
 */
export function PlanTabs({ formAnchor }: { formAnchor: string }) {
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

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

  const u = units[i];
  const v = u.plans[Math.min(j, u.plans.length - 1)];
  return (
    <div>
      <div role="tablist" aria-label="Home sizes" className="flex flex-wrap gap-2">
        {units.map((x, n) => (
          <button
            key={x.size}
            role="tab"
            aria-selected={n === i}
            onClick={() => {
              setI(n);
              setJ(0);
            }}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
              n === i ? "border-sv-navy bg-sv-navy text-white" : "border-sv-navy/20 text-sv-navy hover:border-sv-navy"
            }`}
          >
            {x.size.toLocaleString("en-IN")} sq ft
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
        <div className="relative aspect-[1600/2344] w-full overflow-hidden rounded-2xl border border-sv-navy/10 bg-white lg:w-[min(520px,calc(78svh*0.6826))]">
          <Image
            key={v.img}
            src={v.img}
            alt={`SkyVue unit ${v.unit}, ${v.facing.toLowerCase()} facing, ${u.size.toLocaleString("en-IN")} sq ft floor plan`}
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className={`object-contain transition duration-700 ${unlocked ? "" : "scale-105 blur-md"}`}
          />
          {unlocked ? (
            <a href={v.img} target="_blank" rel="noopener" className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-sv-navy shadow-sm">
              Open full size
            </a>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-white/30 p-6 text-center">
              <div>
                <p className="text-lg font-light text-sv-navy">See the full floor plan</p>
                <a
                  href={`#${formAnchor}`}
                  className="mt-3 inline-flex rounded-full bg-sv-orange px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                >
                  Unlock floor plans
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="grid content-start gap-5 rounded-2xl bg-white p-6 text-sv-navy">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sv-navy/50">
              {u.plans.length > 1 ? `${u.plans.length} plans in this size · choose a unit` : "Unit"}
            </p>
            <div role="tablist" aria-label={`Units of ${u.size} sq ft`} className="mt-3 flex flex-wrap gap-2">
              {u.plans.map((x, n) => (
                <button
                  key={x.img}
                  role="tab"
                  aria-selected={x.img === v.img}
                  onClick={() => setJ(n)}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
                    x.img === v.img ? "border-sv-orange bg-sv-orange text-white" : "border-sv-navy/20 text-sv-navy hover:border-sv-navy"
                  }`}
                >
                  {x.unit} · {x.facing}
                </button>
              ))}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-[0.2em] text-sv-navy/50">Home</dt>
              <dd className="mt-1 text-xl font-light">{u.label}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-sv-navy/50">Size</dt>
              <dd className="mt-1 text-xl font-light">{u.size.toLocaleString("en-IN")} sq ft</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-sv-navy/50">Facing</dt>
              <dd className="mt-1 text-xl font-light">{v.facing}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-sv-navy/50">Unit</dt>
              <dd className="mt-1 text-xl font-light">
                Tower {v.tower} · {v.unit}
              </dd>
            </div>
          </dl>
          <div className="rounded-xl border-l-4 border-sv-orange bg-sv-orange/5 px-4 py-3.5">
            <p className="text-lg font-semibold text-sv-navy">Book this home with just 5%.</p>
            <p className="mt-1 text-sm leading-relaxed text-sv-navy/80">
              {withStar("Then pay nothing more until your block's structure is complete.* No-cost EMI on bookings till 31 Dec 2026.* Your savings stay with you while your home goes up.")}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-sv-orange">Only on bookings made by 31 Dec 2026.</p>
          </div>
          <a href={`#${formAnchor}`} className="inline-flex justify-center rounded-full bg-sv-orange px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Get my 5% payment schedule
          </a>
          <p className="text-xs text-sv-navy/60">Typical unit plan from the SkyVue brochure. Furniture is indicative.</p>
        </div>
      </div>
    </div>
  );
}
