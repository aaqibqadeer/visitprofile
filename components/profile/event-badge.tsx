/** Cultural event chip — gold-bordered capsule for event/festival branding. */
export function EventBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-accent/65 bg-black/25 px-3 py-1.5 backdrop-blur-sm">
      {/* small Ajrak diamond motif */}
      <svg
        className="size-2.5 shrink-0 text-accent"
        viewBox="0 0 10 10"
        fill="currentColor"
        aria-hidden
      >
        <path d="M5 0L10 5L5 10L0 5Z" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
      <span className="text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">
        {label}
      </span>
      <svg
        className="size-2.5 shrink-0 text-accent"
        viewBox="0 0 10 10"
        fill="currentColor"
        aria-hidden
      >
        <path d="M5 0L10 5L5 10L0 5Z" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}
