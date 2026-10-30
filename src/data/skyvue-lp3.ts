/**
 * LP3 · "70 ft above" — the dream-outcome page (Hormozi: dream outcome ↑, effort ↓).
 * Audience: families moving up who want calm, height and a view, not a township.
 * Shared facts (price, RERA, units, FAQs, approvals) live in ./skyvue-landing.ts.
 */
import type { HeroCopy, Version } from "./skyvue-landing";

export const lp3 = {
  id: "lp3" as const,
  slug: "skyvue-70ft-above",
  defaultVersion: "family" as Version,
  hero: {
    family: {
      eyebrow: "Tellapur · Exclusive 3 BHK luxury homes",
      title: "Life starts 70 ft up.",
      sub: "Every SkyVue home begins 70 ft above a car-free podium, with a balcony that opens to 180° views. The noise stays below.",
      size: "Every home from 2,010 sq ft. Up to 2,890.",
    },
    buyer: {
      eyebrow: "Tellapur · Starting from ₹1.6 Cr",
      title: "Rise above the traffic. Literally.",
      sub: "Your home starts 70 ft above the ground. Cars stay on 6 parking levels below; the podium is kept for people.",
      size: "Exclusive 3 BHK only. 2,010 to 2,890 sq ft.",
    },
    parents: {
      eyebrow: "Tellapur · A podium with no cars",
      title: "Quiet mornings, 70 ft above the noise.",
      sub: "Walk a podium with no cars, a senior citizen garden and a Miyawaki forest. Come home to a balcony with a view.",
      size: "Every home from 2,010 sq ft. Up to 2,890.",
    },
  } satisfies Record<Version, HeroCopy>,
  heroCta: "Get floor plans & cost sheet",
  formTitle: "Get the floor plans & the view from your floor",
  formCta: "Send me the details",
  images: { visit: "/lp/skyvue/fr/miyawaki.webp" },
  seo: {
    title: "Vaishno SkyVue Tellapur | Homes Start 70 ft Above a Car-free Podium | RERA P01100010545",
    description:
      "Exclusive 3 BHK luxury homes in Tellapur that start 70 ft above a car-free podium, with balconies and 180° views. 2,010–2,890 sq ft, starting from ₹1.6 Cr. RERA P01100010545.",
  },
};

/** The altitude scene: what you pass on the way up (bottom → top). */
export const altitudeLevels = [
  { id: "street", k: "Street level", v: "0 ft", d: "Traffic, horns and dust stay here." },
  { id: "parking", k: "6 parking levels", v: "Cars below", d: "Every car parks inside the base." },
  { id: "podium", k: "Car-free podium", v: "Gardens", d: "Lawns, a Miyawaki forest and play areas." },
  { id: "homes", k: "Homes begin", v: "70 ft", d: "The first home is already above the treetops." },
  { id: "top", k: "36 storeys", v: "180° views", d: "Floor to floor 10′4″, balconies up to ~46 ft." },
] as const;

/** "Down there / Up here" — the contrast, only confirmed facts on the SkyVue side. */
export const contrast = {
  down: ["Cars at your gate and under your window", "Horns and dust at eye level", "A view of the next building", "Children playing beside parked cars"],
  up: ["Homes that start 70 ft up", "A podium with no cars at all", "Balconies with 180° views", "75% open space on 3.76 acres"],
} as const;

export const lp3Faqs = [
  { q: "What does \"70 ft above\" mean?", a: "The first homes at SkyVue start about 70 ft above the podium. Cars stay on 6 parking levels inside the base, so the podium and the ground are kept for people." },
  { q: "Which way do the homes face?", a: "There are east- and west-facing homes in both towers. Pick a size in the floor plans and each unit shows its facing." },
  { q: "How big are the balconies?", a: "Every home has a sculpted balcony with 180° views, and select floors get an extended balcony of up to about 46 ft." },
] as const;
