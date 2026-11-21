import { lp2 } from "@/data/skyvue-lp2";

/**
 * LP2 · family still, just before the enquiry form (it leads into "Tell us how you'd like to pay").
 * A still from "SkyVue Final 4K V-02.mp4" (23.50 s: the family smiling at the laptop screen together, eyes open),
 * no scroll scrubbing. Desktop: the photo fills the right and fades into navy, copy on the left.
 * Phones: a portrait composition (the whole family at the top, fading into navy) with the copy below.
 */
export function PayFilm() {
  return (
    <section aria-labelledby="pay-film-title" className="sv-payimg" id="pay-film">
      <picture>
        <source media="(max-width: 767px)" srcSet="/lp/skyvue/fr/family-plan-m.webp" />
        <img className="sv-payimg-photo" src="/lp/skyvue/fr/family-plan.webp" alt="A family planning their home payments together at the laptop" loading="lazy" decoding="async" />
      </picture>
      <div className="sv-wrap sv-payimg-copy">
        <div className="sv-payimg-inner">
          <h2 id="pay-film-title" className="[font-family:var(--sv-display)] font-normal text-white">
            <span className="sv-h2-kicker block font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-sv-orange sm:text-xs">{lp2.kw.plan}</span>
            <span className="mt-4 block">Bring your dates. We&apos;ll bring the plan.</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">Make your home purchase work around your finances with Vaishno SkyVue&apos;s Pay Your Way option. Choose your preferred payment amounts and dates to receive a personalised payment plan for your 3 BHK home.</p>
          <a href="#enquire" className="sv-btn sv-btn-primary mt-6">
            Get my Pay Your Way quote
          </a>
        </div>
      </div>
    </section>
  );
}
