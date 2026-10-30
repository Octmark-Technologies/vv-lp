"use client";

import { ScrollFrames } from "../ScrollFrames";
import { openEnquiry } from "./EnquiryDrawer";

/**
 * LP1 film scenes, cut from "SkyVue Final 4K V-02.mp4" and scrubbed by the scroll (ScrollFrames).
 * Placed by the value equation (Hormozi): proof after the claim, the dream before the product,
 * low effort before the amenities. The other approved shots (podium-overhead, rooftop) are kept
 * for the other landing pages.
 */

export type CopyProps = { eyebrow: string; title: string; body: string; cta?: { label: string; onClick: () => void } };

export function Copy({ eyebrow, title, body, cta }: CopyProps) {
  return (
    <div className="sv-frames-copy">
      <div className="sv-wrap">
        <div className="sv-frames-copy-inner">
          <p className="sv-frames-eyebrow">{eyebrow}</p>
          <h2 className="sv-frames-title">{title}</h2>
          <p className="sv-frames-body">{body}</p>
          {cta && (
            <button type="button" onClick={cta.onClick} className="sv-btn sv-btn-primary sv-frames-cta">
              {cta.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Proof · right after "Why 570 matters": the open space the 570 families share. */
export function PodiumFilm() {
  return (
    <section aria-label="The SkyVue podium">
      <ScrollFrames
        shot="podium-lawn"
        frames={59}
        mobileFrames={29}
        heightClass="[html.motion_&]:h-[150vh] md:[html.motion_&]:h-[170vh]"
        alt="The landscaped podium lawn between SkyVue's two towers"
        focusX={0.45}
      >
        <Copy
          eyebrow="The podium · 75% open space"
          title="Shared by 570 families, not 2,000."
          body="Cars park below. The car-free podium stays for lawns, walks, play and long evenings outdoors."
        />
      </ScrollFrames>
    </section>
  );
}

/** Dream outcome · before Homes & plans: the address, at dusk. */
export function TowersFilm() {
  return (
    <section aria-label="SkyVue at dusk">
      <ScrollFrames
        shot="towers-dusk"
        frames={116}
        mobileFrames={58}
        heightClass="[html.motion_&]:h-[200vh] md:[html.motion_&]:h-[240vh]"
        alt="SkyVue's two towers lit up at dusk, seen from the road in Tellapur"
        focusX={0.45}
        minVisibleW={0.55}
        alignY={0.32}
      >
        <Copy
          eyebrow="Tellapur · every evening"
          title="Come home to this."
          body="Two towers. Only 570 exclusive 3 BHK homes. Every home starts 70 ft above a car-free podium."
        />
      </ScrollFrames>
    </section>
  );
}

/** Low effort · before Amenities: the clubhouse, a lift ride away. */
export function ClubhouseFilm() {
  return (
    <section aria-label="The SkyVue clubhouse">
      <ScrollFrames
        shot="clubhouse"
        frames={59}
        mobileFrames={29}
        heightClass="[html.motion_&]:h-[150vh] md:[html.motion_&]:h-[170vh]"
        alt="The double-height SkyVue clubhouse lounge with glass walls"
        focusX={0.35}
      >
        <Copy
          eyebrow="The clubhouse · G+5"
          title="Your lounge, one lift ride away."
          body="A double-height clubhouse with glass on every side, part of 2 lakh sq ft for lifestyle."
          cta={{ label: "Book a site visit", onClick: () => openEnquiry("film-clubhouse", "site_visit") }}
        />
      </ScrollFrames>
    </section>
  );
}

/** Dream outcome · right after "Built for 570 families": where you will live. Burned-in title removed from the film. */
export function HorizonFilm() {
  return (
    <section aria-label="The view from SkyVue">
      <ScrollFrames
        shot="horizon"
        frames={60}
        mobileFrames={30}
        heightClass="[html.motion_&]:h-[150vh] md:[html.motion_&]:h-[170vh]"
        alt="SkyVue's balconies looking out over the green horizon of Tellapur"
        focusX={0.62}
        minVisibleW={0.62}
        alignY={0.3}
      >
        <Copy
          eyebrow="70 ft up · 180° views"
          title="The horizon has a new address."
          body="Living floors start 70 ft above the podium, with sculpted balconies that open to the horizon."
        />
      </ScrollFrames>
    </section>
  );
}

/** Dream outcome · after "Come home to this", into the floor plans: your own balcony. Burned-in line removed. */
export function BalconyFilm() {
  return (
    <section aria-label="A SkyVue balcony">
      <ScrollFrames
        shot="balcony"
        frames={27}
        mobileFrames={14}
        heightClass="[html.motion_&]:h-[140vh] md:[html.motion_&]:h-[150vh]"
        alt="A wide SkyVue balcony with lounge chairs, looking over the city at sunset"
        focusX={0.6}
        minVisibleW={0.66}
        alignY={0.28}
      >
        <Copy
          eyebrow="Your balcony · up to ~46 ft"
          title="As far as the eye can see."
          body="Every home gets a sculpted balcony with 180° views. Select floors get an extended balcony."
          cta={{ label: "See the floor plans", onClick: go("homes") }}
        />
      </ScrollFrames>
    </section>
  );
}
