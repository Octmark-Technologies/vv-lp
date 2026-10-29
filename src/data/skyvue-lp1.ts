/**
 * LP1 · "570 homes. Not a township." — page-specific content.
 * Shared facts (price, RERA, units, FAQs, approvals) live in ./skyvue-landing.ts.
 * Source: SkyVue Landing Page Blueprint (27 Oct 2026), sections "The 4 pages" and
 * "Opening, building study and 3D assets".
 */
import type { HeroCopy, Version } from "./skyvue-landing";

export const lp1 = {
  id: "lp1" as const,
  slug: "skyvue-570-homes",
  defaultVersion: "family" as Version,
  hero: {
    family: {
      eyebrow: "Tellapur · Exclusive 3 BHK homes",
      title: "570 homes. Not a township.",
      sub: "570 exclusive 3 BHK homes in a luxury community, on 3.76 acres with 75% open space.",
      size: "Every home starts at 2,010 sq ft. Up to 2,890.",
    },
    buyer: {
      eyebrow: "Tellapur · From ₹7,399 per sq ft",
      title: "Bigger projects don't mean bigger homes.",
      sub: "570 exclusive 3 BHK homes in a luxury community of only 2 towers.",
      size: "3 BHK only. 2,010 to 2,890 sq ft. No small units.",
    },
    parents: {
      eyebrow: "Tellapur · 570 families · 2 towers",
      title: "A neighbourhood your parents can know by name.",
      sub: "A luxury community with a clinic, pharmacy, senior citizen gym and garden inside the gate, on a podium with no cars.",
      size: "A room for everyone. Every home from 2,010 sq ft, with a study.",
    },
  } satisfies Record<Version, HeroCopy>,
  formTitle: "Get the floor plans, cost sheet & RERA details",
  formCta: "Send me the details",
  seo: {
    title: "Vaishno SkyVue Tellapur | 570 Exclusive 3 BHK Luxury Homes | RERA P01100010545",
    description:
      "570 exclusive 3 BHK luxury homes in 2 towers on 3.76 acres in Tellapur. 3 BHK, 2,010–2,890 sq ft, from ₹7,399 per sq ft. 75% open space. Possession Mar 2030. RERA P01100010545.",
  },
};

/**
 * "The build" scene hotspots, in fractions of towers-full-alpha (2400 × 1267),
 * measured on the render. Order = the order they light up on scroll (bottom → top).
 */
export const buildHotspots = [
  { id: "parking", x: 0.13, y: 0.895, w: 0.66, h: 0.09, value: "6", label: "Levels of parking", note: "Cars stay inside the base, never on the ground" },
  { id: "podium", x: 0.14, y: 0.845, w: 0.65, h: 0.055, value: "0", label: "Cars on the podium", note: "Gardens, a Miyawaki forest and play areas instead" },
  { id: "homes", x: 0.15, y: 0.80, w: 0.5, h: 0.05, value: "70 ft", label: "Where homes begin", note: "Above the podium, with 180° views" },
  { id: "club", x: 0.64, y: 0.745, w: 0.125, h: 0.145, value: "G+5", label: "Clubhouse", note: "Rooftop pool, part of 2 lakh sq ft for lifestyle" },
  { id: "towers", x: 0.155, y: 0.0, w: 0.49, h: 0.8, value: "570", label: "Homes in 2 towers", note: "36 storeys, 8 homes a floor" },
] as const;

/** "Life at SkyVue" — Final Renders (client, 6K) served as 2400 px WebP. */
const fr = (f: string) => `/lp/skyvue/fr/${f}.webp`;
export const gallery = [
  { title: "Rooftop pool", note: "On the clubhouse terrace", img: fr("pool") },
  { title: "Miyawaki forest", note: "A dense native forest inside the gate", img: fr("miyawaki") },
  { title: "Podium pergolas", note: "Shade, seating and table tennis", img: fr("podium-pergola") },
  { title: "Pickleball court", note: "With a half-basketball court", img: fr("pickleball") },
  { title: "Senior citizen garden", note: "Walks away from traffic", img: fr("senior-garden") },
  { title: "Open gym", note: "On the podium", img: fr("open-gym") },
  { title: "Pet park", note: "Plus a pet clinic & spa", img: fr("pets-park") },
  { title: "Badminton court", note: "Double height, indoors", img: fr("badminton") },
  { title: "Activity room", note: "For every generation", img: fr("activity-room") },
  { title: "Indoor games", note: "Table tennis, foosball and more", img: fr("indoor-games") },
  { title: "Party hall", note: "Double height, for family occasions", img: fr("party-hall") },
  { title: "Waiting lounge", note: "Arrival lobby of the clubhouse", img: fr("waiting-lounge") },
] as const;

/** Angle block (B5) for LP1. */
export const lp1Angle = {
  eyebrow: "Why 570 matters",
  title: "A township is a city. 570 homes is a neighbourhood.",
  body: "Large 3 BHK homes in this belt usually come inside communities of 759 to 2,055 homes. SkyVue keeps it to 570 homes in 2 towers, so the pool, the courts and the lifts are shared by fewer families.",
  points: [
    { value: "570", label: "Homes, 2 towers", text: "8 homes a floor across 36 storeys" },
    { value: "75%", label: "Open space", text: "On 3.76 acres, with a car-free podium" },
    { value: "2 lakh", label: "Sq ft for lifestyle", text: "Including a G+5 clubhouse" },
    { value: "100%", label: "Exclusive 3 BHK", text: "No small units in the community" },
  ],
  townshipMin: 759,
  townshipMax: 2055,
} as const;
