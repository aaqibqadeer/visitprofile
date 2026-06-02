import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetaItem } from "@/data/types";
import { ActionButton } from "@/components/action/action-button";

/** The "Now / Reading / Notes" strip under the contact tiles. */
export function MetaRow({ items }: { items: MetaItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-t border-paper-line pt-3.5">
      {items.map((item) => (
        <MetaCell key={item.label} item={item} />
      ))}
    </div>
  );
}

function MetaCell({ item }: { item: MetaItem }) {
  const value = (
    <span
      className={cn(
        "mt-1 flex items-center gap-1 truncate text-sm text-ink",
        item.serif && "font-serif italic"
      )}
    >
      {item.dot && <span className="size-1.5 shrink-0 rounded-full bg-accent" />}
      <span className="truncate">{item.value}</span>
      {item.external && <ArrowUpRight className="size-3 shrink-0 text-ink-faint" />}
    </span>
  );

  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {item.label}
      </p>
      {item.action ? (
        <ActionButton action={item.action} className="block w-full text-left">
          {value}
        </ActionButton>
      ) : (
        value
      )}
    </div>
  );
}
