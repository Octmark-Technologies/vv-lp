import { projects } from "./projects";

/**
 * Headline numbers.
 *
 * Calculated from the portfolio (see projects.ts):
 *  - Homes: 943 delivered + 1,041 under development = 1,984  → "2,000+"
 *  - Land:  13.5 ac delivered + 12.5 ac ongoing = 26.05 ac      → "26+"
 *  - Area (estimated saleable + amenity built-up):
 *      Delivered 943 homes × ~1,200 sq ft avg            ≈ 11.3 lakh
 *      SkyVue 570 × ~2,450 + 2 lakh lifestyle area       ≈ 16.0 lakh
 *      Sapphire 258 × ~1,700                             ≈  4.4 lakh
 *      Ambaram 143 × ~1,585                              ≈  2.3 lakh
 *      Luxuria 70 × ~2,000                               ≈  1.4 lakh
 *                                                 Total  ≈ 35.4 lakh → "35 Lakh+"
 *  Replace the area figure with the client's audited number when available.
 */
const homes = projects.reduce((s, p) => s + p.units, 0);
const acres = projects.reduce((s, p) => s + p.acres, 0);
const delivered = projects.filter((p) => p.status === "completed");

export const stats = [
  { value: 35, suffix: " Lakh+", label: "Sq ft developed & under development" },
  { value: Math.floor(homes / 10) * 10, suffix: "+", label: "Homes delivered & in the making" },
  { value: Math.floor(acres), suffix: "+", label: "Acres of land developed" },
  { value: projects.length, suffix: "", label: "Landmark projects across 2 cities" },
] as const;

export const deliveredHomes = delivered.reduce((s, p) => s + p.units, 0);
export const yearsOfExperience = 10;

export const company = {
  name: "Vaishno Ventures",
  tagline: "Homes built on trust, delivered on time.",
  description:
    "A Hyderabad and Bengaluru real estate developer with over a decade of delivered communities, 900+ families at home and a new generation of high-rise living in West Hyderabad.",
  address: {
    line1: "1st Floor, Splendor Towers, Plot No. 122 & 123",
    line2: "Doyens Lakeside Township, Serilingampally",
    city: "Hyderabad, Telangana 500019",
  },
  phones: {
    hyderabad: "+91 96969 65566",
    bengaluru: "+91 89888 95566",
  },
  email: "support@vaishnoventures.com",
  whatsapp: "919696965566",
  socials: {
    instagram: "https://www.instagram.com/vaishno_ventures/",
    facebook: "https://www.facebook.com/vaishnoventures/",
    linkedin: "https://www.linkedin.com/company/vaishno-ventures/",
    youtube: "https://www.youtube.com/@vaishno_ventures",
  },
};

export const nav = [
  { href: "/about/", label: "About" },
  { href: "/projects/", label: "Projects" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/channel-partner/", label: "Channel Partner" },
  { href: "/blog/", label: "Blog" },
  { href: "/contact-us/", label: "Contact Us" },
];

export const pillars = [
  {
    title: "On-time delivery",
    body: "A decade of handovers across East Bengaluru — every community delivered as promised.",
  },
  {
    title: "Transparent process",
    body: "RERA-registered projects, clear pricing and documentation you can read before you sign.",
  },
  {
    title: "Space as a standard",
    body: "Low density, high open space and amenity area per family — designed for how people actually live.",
  },
  {
    title: "Built to last",
    body: "Engineering-first construction, reputed architects and quality checks at every stage.",
  },
];

/** Opening lines of the homeowner reviews on the current vaishnoventures.com — paste full text from the client. */
export const testimonials = [
  {
    quote: "I want to say on record that I'm really happy with my home in Vaishno Solitair.",
    name: "Vijay Malhotra",
    project: "Vaishno Solitair",
  },
  {
    quote: "I am a proud owner of a home in Vaishno Silverbells.",
    name: "Vidya Murthy",
    project: "Vaishno Silverbells",
  },
  {
    quote: "I recently acquired a residence in Vaishno Silverbells, and I am very much satisfied.",
    name: "Anita Sharma",
    project: "Vaishno Silverbells",
  },
  {
    quote: "I got a house in Vaishno Seasons a few months ago. The place is well-kept.",
    name: "Raghu Ram",
    project: "Vaishno Seasons",
  },
];

export const faqs = [
  {
    q: "Where are Vaishno Ventures projects located?",
    a: "We have delivered communities across East Bengaluru — Hoodi, KR Puram, Varthur, Ramamurthy Nagar and Choodasandra — and are building in Tellapur and Kollur in West Hyderabad, plus Varthur and Gunjur in Bengaluru.",
  },
  {
    q: "Are your projects RERA registered?",
    a: "Yes. Every ongoing project carries its RERA registration number, shown on its project page.",
  },
  {
    q: "How do I book a site visit?",
    a: "Use any Enquire button or call our sales team. We’ll schedule a guided visit and share brochures, floor plans and pricing in advance.",
  },
  {
    q: "Do you support NRI buyers?",
    a: "Yes — virtual walkthroughs, documentation and home-loan assistance, power-of-attorney guidance and post-handover property management.",
  },
  {
    q: "What payment plans are available?",
    a: "Plans vary by project. SkyVue, for example, offers a 5% booking with no further payments until your tower’s structure is complete, plus no-cost EMI on bookings till 31 Dec 2026.",
  },
];
