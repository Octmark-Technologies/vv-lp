import { lpPaths } from "@/data/lp-paths";
import "../lp1/lp1.css";
import { lp2, lp2Faqs } from "@/data/skyvue-lp2";
import { Faq, Footer, Homes } from "../lp1/Sections";
import { DesktopWhatsApp, FactRail, Header, ProgressPillar } from "../lp1/Chrome";
import { EnquiryDrawer } from "../lp1/EnquiryDrawer";
import { LpProvider } from "../lp1/PageConfig";
import { PayHero } from "./PayHero";
import { PayFilm } from "./PayFilm";
import { Lp2Life } from "./Lp2Life";
import { PlanCalculator } from "./PlanCalculator";
import { Lp2Enquire } from "./Lp2Enquire";
import { OfferNudge } from "./OfferNudge";
import { ScrollReveal } from "./ScrollReveal";

/**
 * LP2 · "Pay Your Way" (replaced Pay 5% on 20 Nov 2026)  →  /3-bhk-flats-for-sale/ (old /pay-5-percent/ redirects here)
 * Versions on ?v=: buyer (default) | deadline | buyers | upgrade | nri | plan | family | parents.
 * Own design (27 Oct 2026), deliberately unlike LP1: "night" theme (.sv-night), its own renders
 * and a short film hero cut from the SkyVue brand film.
 * Order (short page, 20 Nov 2026): film hero (PayHero, one shot from the brand film) → how it
 * works + your price → homes & plans → life at SkyVue (4 renders) → 3-step form → FAQ →
 * footer (#terms). Plus the once-per-session nudge.
 */
export function Lp2Page() {
  return (
    <LpProvider value={lp2}>
      <div className="sv1 sv-night" data-lp={lp2.id} id="top">
        <Header />
        <main>
          <PayHero />
          <PlanCalculator />
          <Homes />
          <Lp2Life />
          <PayFilm />
          <Lp2Enquire />
          <Faq items={lp2Faqs} />
        </main>
        <Footer />
        <FactRail />
        <ProgressPillar />
        <DesktopWhatsApp />
        <OfferNudge />
        <ScrollReveal />
        <EnquiryDrawer pageId={lp2.id} pageSlug={lp2.slug} title={lp2.formTitle} cta={lp2.formCta} />
      </div>
    </LpProvider>
  );
}

export const lp2Metadata = {
  title: { absolute: lp2.seo.title },
  description: lp2.seo.description,
  alternates: { canonical: lpPaths.lp2 },
  robots: { index: false, follow: true },
  openGraph: {
    title: lp2.seo.title,
    description: lp2.seo.description,
    url: lpPaths.lp2,
    images: [{ url: "/lp/skyvue/fr/aerial.webp" }],
  },
};
