/** Frosted "Available · Q3" pill with a live dot. */
export function StatusBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
      <span className="size-2 rounded-full bg-accent shadow-[0_0_6px] shadow-accent" />
      <span className="text-xs font-medium uppercase tracking-wider text-white">
        {label}
      </span>
    </div>
  );
}
