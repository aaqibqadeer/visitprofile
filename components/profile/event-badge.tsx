import { AjrakStar } from "./ajrak";

/**
 * Premium cultural event badge — a maroon capsule with a gold border and small
 * Ajrak star motifs flanking the label (e.g. "SINDHI DAY • SANA EVENT").
 * Replaces the plain availability pill when a profile sets `eventBadge`.
 */
export function EventBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-accent/80 bg-paper/85 px-3.5 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <AjrakStar className="size-3.5 text-accent" />
      <span className="text-[11px] font-semibold tracking-[0.16em] text-ink uppercase">
        {label}
      </span>
      <AjrakStar className="size-3.5 text-accent" />
    </div>
  );
}
