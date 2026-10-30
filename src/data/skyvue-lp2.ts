/**
 * LP2 · "Pay 5%" — page-specific content. Copy rebuilt 27 Oct 2026 (content-creation skill,
 * Hormozi value equation, GTM positioning: "a boutique community of exclusive 3 BHK luxury
 * homes for families moving up, in Tellapur").
 *
 * Offer, as Rahul gave it: pay 5% (no-cost EMI), then nothing more until the structure of the
 * block the buyer's home is in is complete. Every condition-bearing claim carries a "*" that
 * links to the terms note (skyvue.offer.terms). Base-vs-agreement value and the EMI partner are
 * not stated anywhere: the cost sheet gives the exact figures.
 */
import { faqs, type HeroCopy, type Version } from "./skyvue-landing";

export const lp2 = {
  id: "lp2" as const,
  slug: "skyvue-pay-5-percent",
  defaultVersion: "buyer" as Version,
  intent: "payment_schedule" as const,
  hero: {
    buyer: {
      eyebrow: "Offer on bookings till 31 Dec 2026",
      title: "Pay 5%. Then nothing more until your block's structure is complete.*",
      sub: "No-cost EMI on bookings till 31 Dec 2026.* Exclusive 3 BHK luxury homes in Tellapur, starting from ₹1.6 Cr.",
      size: "3 BHK only. 2,010 to 2,890 sq ft. No small units.",
    },
    family: {
      eyebrow: "Offer on bookings till 31 Dec 2026",
      title: "Move up to an exclusive 3 BHK. Pay 5%, then relax while your block rises.*",
      sub: "Nothing more to pay until your block's structure is complete.* No-cost EMI on bookings till 31 Dec 2026.* A luxury community of only 570 homes in Tellapur.",
      size: "Every home starts at 2,010 sq ft. Up to 2,890.",
    },
    parents: {
      eyebrow: "TS RERA P01100010545 · Starting from ₹1.6 Cr",
      title: "Book with 5%. Pay nothing more till your block's structure is complete.*",
      sub: "Exclusive 3 BHK luxury homes with a clinic, pharmacy and senior citizen gym inside the gate. No-cost EMI on bookings till 31 Dec 2026.*",
      size: "A room for everyone. Every home from 2,010 sq ft, with a study.",
    },
  } satisfies Record<Version, HeroCopy>,
  heroCta: "Get my 5% payment schedule",
  /** LP2 never repeats LP1's pictures. */
  images: {
    amenities: {
      care: { img: "/lp/skyvue/fr/badminton.webp", caption: "Double-height badminton court" },
      work: { img: "/lp/skyvue/fr/activity-room.webp", caption: "Activity room" },
      family: { img: "/lp/skyvue/fr/party-hall.webp", caption: "Party hall" },
      gardens: { img: "/lp/skyvue/fr/miyawaki.webp", caption: "Miyawaki forest" },
    },
    visit: "/lp/skyvue/fr/entrance.webp",
  },
  formTitle: "Get the payment schedule for your size",
  formCta: "Send my payment schedule",
  offerEnds: "2026-12-31T23:59:59+05:30",
  seo: {
    title: "Vaishno SkyVue Tellapur | Pay 5% to Book | Exclusive 3 BHK Luxury Homes",
    description:
      "Pay 5%, then nothing more until your block's structure is complete. No-cost EMI on bookings till 31 Dec 2026 (conditions apply). Exclusive 3 BHK luxury homes in Tellapur, starting from ₹1.6 Cr. RERA P01100010545.",
  },
};

/** The payment story told beside the rising tower (BuildScene "pay" mode). "*" = conditions apply. */
export const paySteps = [
  { t: "Book with 5%", d: "Choose your home and pay 5% to book it.*" },
  { t: "Pay nothing more", d: "Your block rises; you stay hands-free until its structure is complete." },
  { t: "No-cost EMI*", d: "On bookings till 31 Dec 2026, as per your payment schedule." },
  { t: "Possession", d: "Planned for 31 March 2030." },
] as const;

/** Meter status per phase of the scene (0 rising · 1 structure complete · 2 possession). */
export const payStatus = [
  { k: "Hands-free", t: "Your block is rising. Nothing more to pay until its structure is complete.*" },
  { k: "Structure complete", t: "No-cost EMI* on bookings till 31 Dec 2026, as per your payment schedule." },
  { k: "Possession", t: "Planned for 31 March 2030. Your exclusive 3 BHK, ready to move in." },
] as const;

/**
 * Hormozi value equation, as the buyer feels it: dream outcome ↑, likelihood ↑, time ↓, effort ↓.
 * Every line is a confirmed fact (no invented bonuses, no fake scarcity).
 */
export const valueStack = [
  { k: "What you get", v: "An exclusive 3 BHK", d: "2,010 to 2,890 sq ft, in a luxury community of only 570 homes with 40 amenities." },
  { k: "Why you can trust it", v: "TS RERA P01100010545", d: "By Vaishno Ventures: 10+ projects across Bangalore and Hyderabad, 900+ families in delivered homes." },
  { k: "What it takes today", v: "Only 5% to book*", d: "Then nothing more until your block's structure is complete.* No-cost EMI on bookings till 31 Dec 2026.*" },
  { k: "How long you wait", v: "31 March 2030", d: "Track your block's progress against the RERA schedule before every payment." },
] as const;

/** Sent on WhatsApp after the form, for the size the visitor picked. */
export const whatYouGet = [
  "The payment schedule for your size",
  "The floor plan and the cost sheet",
  "The RERA certificate and the location pin",
  "A weekday or weekend site visit slot",
] as const;

/** Payment questions first, then the shared FAQ (minus its own payment-plan answer). */
export const lp2Faqs = [
  {
    q: "How does the 5% plan work?",
    a: "You pay 5% to book your home. While the block your home is in rises, you pay nothing more until that block's structure is complete. No-cost EMI is available on bookings till 31 December 2026, as per your payment schedule. Conditions apply.",
  },
  {
    q: "How much is the 5% for my home?",
    a: "It depends on the home you choose. Homes start from ₹1.6 Cr; share your number and your cost sheet will show the exact 5% booking amount for your home.",
  },
  {
    q: "What does \"structure complete\" mean?",
    a: "It is the stage when the structure of the block your home is in is complete. Your payment schedule shows this milestone for your block, and you can track progress against the RERA schedule.",
  },
  {
    q: "Are GST and other charges included?",
    a: "No. GST, parking and other charges are listed separately in the cost sheet for your home.",
  },
  {
    q: "Till when is this offer valid?",
    a: "On bookings made until 31 December 2026. Conditions apply.",
  },
  ...faqs.filter((f) => !/payment plan/i.test(f.q)),
] as const;
