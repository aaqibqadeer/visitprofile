import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileMetaItem } from "@/lib/profile";

/** The "Now / Reading / Notes" strip under the contact tiles. */
export function MetaRow({ items }: { items: ProfileMetaItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-t border-paper-line pt-3.5">
      {items.map((item) => (
        <MetaItem key={item.label} item={item} />
      ))}
    </div>
  );
}

function MetaItem({ item }: { item: ProfileMetaItem }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {item.label}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 truncate text-sm text-ink",
          item.serif && "font-serif italic"
        )}
      >
        {item.dot && <span className="size-1.5 shrink-0 rounded-full bg-online" />}
        <span className="truncate">{item.value}</span>
        {item.external && <ArrowUpRight className="size-3 shrink-0 text-ink-faint" />}
      </p>
    </div>
  );
}
