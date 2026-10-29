/**
 * Bottom line of every landing-page footer: rights to Vaishno Ventures, and the agency credit
 * (Octmark logo only, linking to octmark.com). Sits on the dark footer, so the white logo is used.
 */
export function FooterCredit({ year = 2026 }: { year?: number }) {
  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
      <p>© {year} Vaishno Ventures. All rights reserved.</p>
      <a
        href="https://www.octmark.com/"
        target="_blank"
        rel="noopener"
        aria-label="Designed and developed by Octmark (opens octmark.com)"
        className="group inline-flex items-center gap-3 self-start text-white/50 transition-colors hover:text-white/80 sm:self-auto"
      >
        <span className="text-[11px] uppercase tracking-[0.18em]">Designed &amp; developed by</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/octmark-logo-white.png"
          alt="Octmark"
          width={600}
          height={153}
          className="h-6 w-auto opacity-90 transition-opacity group-hover:opacity-100"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  );
}
