import { Fragment, type ReactNode } from "react";

/** "Conditions apply" mark: an orange superscript * that jumps to the terms note in the footer (#terms). */
export function Star() {
  return (
    <a href="#terms" className="sv-star" aria-label="Conditions apply, see terms" title="Conditions apply">
      *
    </a>
  );
}

/** Renders copy where "*" marks a condition-bearing claim, turning each * into <Star />. */
export function withStar(text: string): ReactNode {
  if (!text.includes("*")) return text;
  const parts = text.split("*");
  return parts.map((t, i) => (
    <Fragment key={i}>
      {t}
      {i < parts.length - 1 && <Star />}
    </Fragment>
  ));
}
