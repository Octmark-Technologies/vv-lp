import Link from "next/link";
import { lpPaths, privacyUrl } from "@/data/lp-paths";
import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import {
  approvals,
  careInsideTheGate,
  comparison,
  delivered,
  deliveredHomes,
  faqs,
  formatCr,
  formatLakh,
  landingPages,
  lifestyle,
  locationGuide,
  masterPlans,
  skyvue,
  units,
  type LandingPage,
  type SectionKey,
} from "@/data/skyvue-landing";
import { company } from "@/data/company";
import { Check, Phone, Pin, Plus, WhatsApp } from "@/components/Icons";
import { HeroCopy, HeroText } from "./HeroCopy";
import { LeadForm } from "./LeadForm";
import { PlanTabs } from "./PlanTabs";
import { FooterCredit } from "./FooterCredit";
import { OfferCountdown } from "./Countdown";

const HERO_FORM = "enquire";
const VISIT_FORM = "book-visit";

/* ───────────────────────── Small building blocks ───────────────────────── */

function Section({
  id,
  tone = "white",
  children,
}: {
  id?: string;
  tone?: "white" | "sky" | "navy" | "mist";
  children: ReactNode;
}) {
  const bg = {
    white: "bg-white text-sv-navy",
    mist: "bg-sv-mist text-sv-navy",
    sky: "sv-sky text-sv-navy",
    navy: "bg-sv-navy text-white",
  }[tone];
  return (
    <section id={id} className={`${bg} scroll-mt-20 py-16 sm:py-24`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, title, sub, light }: { eyebrow: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sv-orange">{eyebrow}</p>
      <h2 className="mt-3 font-sans text-3xl font-light leading-tight tracking-tight sm:text-[42px]">{title}</h2>
      {sub && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/75" : "text-sv-navy/70"}`}>{sub}</p>}
    </div>
  );
}

function CtaButton({ href, children, ghost }: { href: string; children: ReactNode; ghost?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition ${
        ghost ? "border border-current/30 hover:border-current" : "bg-sv-orange text-white hover:brightness-110"
      }`}
    >
      {children}
    </a>
  );
}

const waLink = (text: string) => `https://wa.me/${skyvue.whatsapp}?text=${encodeURIComponent(text)}`;

/* ───────────────────────── Sections ───────────────────────── */

function TopBar({ page }: { page: LandingPage }) {
  return (
    <header className="sticky top-0 z-40 border-b border-sv-navy/10 bg-white/95 backdrop-blur">
      <div className="bg-sv-navy px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white sm:text-xs">
        <span className="text-sv-orange">Offer:</span> {skyvue.offer.text}{" "}
        <span className="whitespace-nowrap">Bookings till {skyvue.offer.validTill}.</span>
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <a href={lpPaths[page.id]} aria-label="Vaishno SkyVue" className="relative block h-9 w-[100px] sm:h-10 sm:w-[110px]">
          <Image src="/lp/skyvue/skyvue-logo.png" alt="Vaishno SkyVue" fill sizes="110px" className="object-contain object-left" priority />
        </a>
        <p className="hidden text-[11px] uppercase tracking-[0.2em] text-sv-navy/60 md:block">
          TS RERA <strong className="font-semibold text-sv-navy">{skyvue.rera}</strong>
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          <OfferCountdown variant="bar" />
          <a
            href={`tel:${skyvue.phone}`}
            className="hidden items-center gap-2 rounded-full border border-sv-navy/20 px-4 py-2 text-sm font-semibold text-sv-navy sm:inline-flex"
          >
            <Phone /> {skyvue.phoneLabel}
          </a>
          <a
            href={`#${VISIT_FORM}`}
            className="rounded-full bg-sv-orange px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white sm:text-sm"
          >
            Book a site visit
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ page }: { page: LandingPage }) {
  return (
    <section className="relative isolate overflow-hidden bg-sv-navy-deep">
      <Image src={page.heroImage} alt={page.heroAlt} fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sv-navy-deep/90 via-sv-navy-deep/60 to-sv-navy-deep/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-sv-navy-deep/80 to-transparent" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_400px] lg:items-center lg:pb-20">
        <div>
          <Suspense fallback={<HeroText copy={page.hero[page.defaultVersion]} />}>
            <HeroCopy copies={page.hero} fallback={page.defaultVersion} />
          </Suspense>
          <ul className="mt-8 flex flex-wrap gap-2 text-[13px] text-white">
            {["3 BHK", skyvue.sizeRange, `From ₹${skyvue.basePrice.toLocaleString("en-IN")}/sq ft`, `Possession ${skyvue.possession}`].map((t) => (
              <li key={t} className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur">
                {t}
              </li>
            ))}
          </ul>
          <OfferCountdown variant="hero" tone="dark" className="sv-cd-start mt-7" />
          <p className="mt-6 text-[11px] text-white/50">TS RERA {skyvue.rera}</p>
        </div>
        <div id={HERO_FORM} className="scroll-mt-28">
          <LeadForm pageId={page.id} pageSlug={page.slug} formId={`${page.id}-hero`} title={page.formTitle} cta={page.ctaLabel} />
        </div>
      </div>
    </section>
  );
}

function Facts() {
  return (
    <section className="border-b border-sv-navy/10 bg-white">
      <dl className="mx-auto grid max-w-6xl grid-cols-3 gap-y-6 px-4 py-8 sm:px-8 md:grid-cols-6">
        {skyvue.facts.map((f) => (
          <div key={f.label} className="flex flex-col-reverse text-center">
            <dt className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sv-navy/55">{f.label}</dt>
            <dd className="text-2xl font-light text-sv-navy sm:text-3xl">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Angle({ page }: { page: LandingPage }) {
  const a = page.angleBlock;
  return (
    <Section tone="sky" id="why">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading eyebrow={a.eyebrow} title={a.title} sub={a.body} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {a.points.map((p) => (
              <li key={p.title} className="rounded-2xl bg-white/70 p-5">
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-sv-navy/70">{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CtaButton href={`#${HERO_FORM}`}>{page.ctaLabel}</CtaButton>
          </div>
        </div>
        <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-[4/5]">
          <Image src={a.img} alt={a.imgAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </figure>
      </div>
    </Section>
  );
}

function Homes() {
  return (
    <Section tone="mist" id="homes">
      <Heading
        eyebrow="Homes & floor plans"
        title="Every home is a 3 BHK with a study."
        sub={`${skyvue.sizeRange}. East- and west-facing homes, floor-to-floor height of 10′4″, sculpted balconies with 180° views and extended balconies on select floors.`}
      />
      <div className="mt-10">
        <PlanTabs formAnchor={HERO_FORM} />
      </div>
      <h3 className="mt-14 font-sans text-xl font-light">Master plan & floor plates</h3>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {masterPlans.map((m) => (
          <a key={m.title} href={m.img} target="_blank" rel="noopener" className="group block overflow-hidden rounded-2xl bg-white">
            <span className="relative block aspect-[3/4]">
              <Image src={m.img} alt={`SkyVue ${m.title} plan`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </span>
            <span className="block px-4 py-3 text-sm font-semibold">{m.title}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}

function PaymentPlan({ page }: { page: LandingPage }) {
  return (
    <Section tone="navy" id="payment-plan">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <Heading
            light
            eyebrow={`Offer · bookings till ${skyvue.offer.validTill}`}
            title={page.id === "lp2" ? "What 5% means for each home size." : "Pay 5%. Then stay hands-free until your tower's structure is complete."}
            sub={page.id === "lp2" ? "Pay 5% to book, then stay hands-free until your tower's structure is complete, with no-cost EMI." : "No-cost EMI on what follows. Ask for the full payment schedule for the size you like."}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton href={`#${HERO_FORM}`}>Get my payment schedule</CtaButton>
            <a
              href={waLink("Hi, please share the SkyVue payment plan and cost sheet.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em]"
            >
              <WhatsApp width={18} height={18} /> Ask on WhatsApp
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/15">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/10 text-[11px] uppercase tracking-[0.16em] text-white/70">
              <tr>
                <th className="px-4 py-3 font-semibold">Home size</th>
                <th className="px-4 py-3 font-semibold">Base value*</th>
                <th className="px-4 py-3 font-semibold text-sv-orange">5% to book*</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => {
                const v = u.size * skyvue.basePrice;
                return (
                  <tr key={u.size} className="border-t border-white/10">
                    <td className="px-4 py-3.5">{u.size.toLocaleString("en-IN")} sq ft</td>
                    <td className="px-4 py-3.5">{formatCr(v)}</td>
                    <td className="px-4 py-3.5 font-semibold text-sv-orange">{formatLakh(v * 0.05)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-white/10 px-4 py-3 text-[11px] leading-relaxed text-white/55">
            *Approximate, on the base price of ₹{skyvue.basePrice.toLocaleString("en-IN")} per sq ft only. GST, parking,
            and other charges are extra and shown in the cost sheet. Offer valid on bookings till {skyvue.offer.validTill}.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Lifestyle() {
  return (
    <Section tone="white" id="lifestyle">
      <Heading
        eyebrow="Life at SkyVue"
        title="2 lakh sq ft for lifestyle. A G+5 clubhouse. A forest inside the gate."
        sub="Everything a family of three generations uses every day, from the crèche to the senior citizen garden."
      />
      <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {lifestyle.map((l) => (
          <figure key={l.title} className="relative w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[46%] lg:w-[31%]">
            <span className="relative block aspect-[4/3]">
              <Image src={l.img} alt={`${l.title} at SkyVue`} fill sizes="(min-width: 1024px) 33vw, 80vw" className="object-cover" />
            </span>
            <figcaption className="bg-sv-mist px-4 py-3">
              <span className="block font-semibold">{l.title}</span>
              <span className="text-sm text-sv-navy/65">{l.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-sv-navy/10 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sv-orange">Care inside the gate</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {careInsideTheGate.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="mt-0.5 text-sv-orange">
                <Check width={16} height={16} />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Comparison() {
  return (
    <Section tone="sky" id="compare">
      <Heading
        eyebrow="Compare base to base"
        title="A lower base price, a smaller community, a larger home."
        sub="Before you decide, put SkyVue next to the other projects on your shortlist."
      />
      <div className="mt-10 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm sm:text-base">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.16em]">
              <th className="px-4 py-4 font-semibold text-sv-navy/50 sm:px-6"> </th>
              <th className="bg-sv-navy px-4 py-4 font-semibold text-white sm:px-6">SkyVue</th>
              <th className="px-4 py-4 font-semibold text-sv-navy/60 sm:px-6">Other projects nearby</th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((r) => (
              <tr key={r.label} className="border-t border-sv-navy/10">
                <td className="px-4 py-4 text-sv-navy/70 sm:px-6">{r.label}</td>
                <td className="bg-sv-navy/[0.04] px-4 py-4 font-semibold sm:px-6">{r.skyvue}</td>
                <td className="px-4 py-4 text-sv-navy/70 sm:px-6">{r.others}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-sv-navy/60">{comparison.footnote}</p>
      <div className="mt-8">
        <a
          href={waLink("Hi, please send me the SkyVue comparison sheet.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white"
        >
          <WhatsApp width={18} height={18} /> Get the comparison sheet
        </a>
      </div>
    </Section>
  );
}

function Location() {
  return (
    <Section tone="white" id="location">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <Heading eyebrow="Location guide · Tellapur" title="Close to work. Next to green." sub={locationGuide.intro} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {locationGuide.groups.map((g) => (
              <div key={g.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sv-navy/50">{g.title}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {g.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 text-sv-orange">
                        <Pin width={16} height={16} />
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={waLink("Hi, please send me the SkyVue location pin.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sv-navy/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em]"
            >
              <Pin /> Get the location pin
            </a>
          </div>
        </div>
        <a href={locationGuide.map} target="_blank" rel="noopener" className="relative block aspect-[1.4] overflow-hidden rounded-3xl bg-sv-mist">
          <Image src={locationGuide.map} alt="SkyVue location map, Tellapur" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </a>
      </div>
    </Section>
  );
}

function Approvals() {
  return (
    <Section tone="mist" id="approvals">
      <Heading
        eyebrow="Approvals"
        title="Check every approval before you call us."
        sub="SkyVue is registered with Telangana RERA. Copies of the approvals below are shared with every buyer."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {approvals.map((a) => (
          <div key={a.label} className="rounded-2xl bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-sv-navy/50">{a.label}</p>
            <p className={`mt-2 text-lg ${a.value ? "font-semibold" : "font-light text-sv-navy/60"}`}>{a.value ?? "Shared on request"}</p>
            {a.note && (
              <a href={skyvue.reraUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-sv-orange underline">
                {a.note}
              </a>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Builder() {
  return (
    <Section tone="navy" id="builder">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <Heading
            light
            eyebrow="Who is Vaishno?"
            title={`Homes for ${Math.floor(deliveredHomes / 100) * 100}+ families, already delivered.`}
            sub="Vaishno Ventures has built and handed over homes across East Bangalore, from Hoodi and KR Puram to Varthur. SkyVue brings the same team to Tellapur."
          />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
            {delivered.map((d) => (
              <li key={d.name}>
                <span className="block font-semibold">{d.name.replace("Vaishno ", "")}</span>
                <span className="text-white/60">
                  {d.area} · {d.homes} homes
                </span>
              </li>
            ))}
          </ul>
        </div>
        <figure>
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
    </Section>
  );
}

function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <Section tone="white" id="faq">
      <Heading eyebrow="FAQ" title="Questions buyers ask us first." />
      <div className="mt-10 divide-y divide-sv-navy/10 border-y border-sv-navy/10">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-light marker:hidden sm:text-xl [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sv-navy/15 text-sv-orange transition-transform duration-300 group-open:rotate-45">
                <Plus />
              </span>
            </summary>
            <p className="mt-3 max-w-3xl leading-relaxed text-sv-navy/70">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Section>
  );
}

function Visit({ page }: { page: LandingPage }) {
  return (
    <section className="relative isolate overflow-hidden bg-sv-navy-deep py-16 text-white sm:py-24">
      <Image src="/lp/skyvue/renders/rooftop-pool.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-35" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_400px] lg:items-center">
        <div>
          <Heading
            light
            eyebrow="Site visit"
            title="See SkyVue for yourself. Bring the family."
            sub="Pick a weekday or weekend slot. Our team confirms it on WhatsApp and walks you through the site, the plans and the cost sheet."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${skyvue.phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em]">
              <Phone /> Call {skyvue.phoneLabel}
            </a>
            <a
              href={waLink("Hi, I'd like to book a SkyVue site visit.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em]"
            >
              <WhatsApp width={18} height={18} /> WhatsApp us
            </a>
          </div>
        </div>
        <div id={VISIT_FORM} className="scroll-mt-28">
          <LeadForm
            pageId={page.id}
            pageSlug={page.slug}
            formId={`${page.id}-visit`}
            title="Book a site visit"
            cta="Book my visit"
            intent="site_visit"
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-sv-navy-deep pb-28 pt-12 text-white/60 sm:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 text-sm sm:px-8 md:grid-cols-[auto_1fr] md:items-start">
        <div className="relative h-12 w-[130px]">
          <Image src="/lp/skyvue/skyvue-logo-white.png" alt="Vaishno SkyVue" fill sizes="130px" className="object-contain object-left" />
        </div>
        <div className="space-y-3 text-xs leading-relaxed">
          <p>
            <strong className="text-white">Vaishno SkyVue</strong>, Tellapur, Hyderabad · TS RERA {skyvue.rera} · A project by{" "}
            {company.name}, {company.address.line1}, {company.address.line2}, {company.address.city}.
          </p>
          <p id="terms" className="scroll-mt-24">{skyvue.offer.terms}</p>
          <p>
            Disclaimer: All images are artist&apos;s impressions and for representation only. Specifications, amenities, plans
            and prices are indicative and subject to change as per approvals. Prices shown are base prices; GST, parking and
            other charges are extra. The payment offer applies to bookings till {skyvue.offer.validTill}. This page is not an
            offer or a contract.
          </p>
          <p>
            <Link href={privacyUrl} className="underline">Privacy policy</Link>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <FooterCredit />
      </div>
    </footer>
  );
}

function StickyBar() {
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-sv-navy/10 bg-white text-[13px] font-semibold text-sv-navy shadow-[0_-8px_30px_-10px_rgba(0,46,88,0.3)] sm:hidden">
      <a href={`tel:${skyvue.phone}`} className="flex items-center justify-center gap-2 py-3.5">
        <Phone /> Call
      </a>
      <a
        href={waLink("Hi, I'd like the SkyVue brochure, floor plans and cost sheet.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] py-3.5 text-white"
      >
        <WhatsApp width={18} height={18} /> WhatsApp
      </a>
      <a href={`#${HERO_FORM}`} className="flex items-center justify-center bg-sv-orange py-3.5 text-white">
        Enquire
      </a>
    </nav>
  );
}

function DesktopWhatsApp() {
  return (
    <a
      href={waLink("Hi, I'd like the SkyVue brochure, floor plans and cost sheet.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg sm:grid"
    >
      <WhatsApp />
    </a>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export function SkyvueLanding({ id }: { id: LandingPage["id"] }) {
  const page = landingPages.find((p) => p.id === id)!;
  const render: Record<SectionKey, ReactNode> = {
    facts: <Facts key="facts" />,
    angle: <Angle key="angle" page={page} />,
    homes: <Homes key="homes" />,
    plan: <PaymentPlan key="plan" page={page} />,
    lifestyle: <Lifestyle key="lifestyle" />,
    comparison: <Comparison key="comparison" />,
    location: <Location key="location" />,
    approvals: <Approvals key="approvals" />,
    builder: <Builder key="builder" />,
    faq: <FaqSection key="faq" />,
    visit: <Visit key="visit" page={page} />,
  };
  return (
    <div data-lp={page.id} className="bg-white font-sans text-sv-navy">
      <TopBar page={page} />
      <Hero page={page} />
      {page.order.map((k) => render[k])}
      <Footer />
      <StickyBar />
      <DesktopWhatsApp />
    </div>
  );
}

export function skyvueMetadata(id: LandingPage["id"]) {
  const page = landingPages.find((p) => p.id === id)!;
  const url = lpPaths[page.id];
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: url },
    robots: page.seo.index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url,
      images: [{ url: page.heroImage }],
    },
  };
}
