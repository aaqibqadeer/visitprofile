/**
 * Ajrak ornamentation — Sindhi block-print motifs rendered as SVG.
 * All shapes use `currentColor`, so colour is controlled by the wrapper's
 * text colour (typically `text-accent` = antique gold).
 */

/** 8-pointed Ajrak star (two overlapping squares) — used as a divider and hero decor. */
export function AjrakStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden className={className}>
      <rect x="4.5" y="4.5" width="15" height="15" strokeWidth="1.4" />
      <rect x="4.5" y="4.5" width="15" height="15" strokeWidth="1.4" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Seamless background texture tile. Keep opacity low on the wrapper. */
export function AjrakTexture({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} width="100%" height="100%">
      <defs>
        <pattern id="ajrak-bg" width="64" height="64" patternUnits="userSpaceOnUse">
          {/* centre 8-point star */}
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <rect x="22" y="22" width="20" height="20" />
            <rect x="22" y="22" width="20" height="20" transform="rotate(45 32 32)" />
          </g>
          <circle cx="32" cy="32" r="2" fill="currentColor" />
          {/* corner diamonds (tile seamlessly) */}
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <rect x="-6" y="-6" width="12" height="12" transform="rotate(45 0 0)" />
            <rect x="58" y="-6" width="12" height="12" transform="rotate(45 64 0)" />
            <rect x="-6" y="58" width="12" height="12" transform="rotate(45 0 64)" />
            <rect x="58" y="58" width="12" height="12" transform="rotate(45 64 64)" />
          </g>
          {/* edge dots */}
          <g fill="currentColor">
            <circle cx="32" cy="0" r="1.4" />
            <circle cx="32" cy="64" r="1.4" />
            <circle cx="0" cy="32" r="1.4" />
            <circle cx="64" cy="32" r="1.4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ajrak-bg)" />
    </svg>
  );
}

/** Decorative vertical Ajrak ribbon for a card edge. */
export function AjrakBorder({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 z-20 w-5"
      style={side === "left" ? { left: 0 } : { right: 0 }}
    >
      <div className="absolute inset-0 bg-surface/80" />
      <svg className="absolute inset-0 text-accent" width="100%" height="100%">
        <defs>
          <pattern id={`ajrak-edge-${side}`} width="20" height="40" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="1.1">
              <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" />
              <rect x="5" y="25" width="10" height="10" transform="rotate(45 10 30)" />
            </g>
            <g fill="currentColor">
              <circle cx="10" cy="0" r="1.3" />
              <circle cx="10" cy="20" r="1.3" />
              <circle cx="10" cy="40" r="1.3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#ajrak-edge-${side})`} />
      </svg>
      <div
        className="absolute inset-y-0 w-px bg-accent/60"
        style={side === "left" ? { right: 0 } : { left: 0 }}
      />
    </div>
  );
}
