import "@fontsource-variable/jost";
import { lpPaths } from "@/data/lp-paths";
import "../lp1/lp1.css";
import { lp2, lp2Faqs } from "@/data/skyvue-lp2";
import { Amenities } from "../lp1/Amenities";
import { Approvals, Builder, Compare, Faq, Footer, Homes, Location, Visit, ProgressBlock } from "../lp1/Sections";
import { DesktopWhatsApp, FactRail, Header, ProgressPillar } from "../lp1/Chrome";
import { ScrollCue } from "../ScrollCue";
import { EnquiryDrawer } from "../lp1/EnquiryDrawer";
import { LpProvider } from "../lp1/PageConfig";
import { Story3D } from "./Story3D";
import { PlanCalculator } from "./PlanCalculator";
import { ValueStack } from "./ValueStack";
import { Lp2Enquire } from "./Lp2Enquire";
import { OfferNudge } from "./OfferNudge";
import { ScrollReveal } from "./ScrollReveal";

/**
 * LP2 · "Pay 5%"  →  /lp/skyvue-pay-5-percent/  (versions: ?v=buyer | family | parents; default buyer)
 * Own design (27 Oct 2026), deliberately unlike LP1: "night" theme (.sv-night), its own renders
 * (aerial, balcony, entrance, badminton, activity room, party hall, Miyawaki), and a 3D story in
 * place of LP1's pillar opening and tower rise: the client's aerial render in Three.js (projection
 * route of img2threejs, Depth Anything V2 depth, pixel-exact at the reference camera).
 * Order: Story3D (hook → 5% → nothing more while your block rises* → no-cost EMI* → possession) →
 * calculator → why 5% is enough → homes & plans → amenities → approvals → compare → 3-step form →
 * location → who is Vaishno → FAQ → site visit → footer (#terms). Plus the once-per-session nudge.
 */
export function Lp2Page() {
  return (
    <LpProvider value={lp2}>
      <div className="sv1 sv-night" data-lp={lp2.id} id="top">
        <Header />
        <main>
          <Story3D />
          <PlanCalculator />
          <ValueStack />
          <Homes />
          <Amenities />
          <Approvals />
          <ProgressBlock />
          <Compare />
          <Lp2Enquire />
          <Location />
          <Builder />
          <Faq items={lp2Faqs} />
          <Visit />
        </main>
        <Footer />
        <FactRail />
        <ProgressPillar />
        <ScrollCue tone="dark" onImage />
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
