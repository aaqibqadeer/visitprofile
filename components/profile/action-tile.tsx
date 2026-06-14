import type { LinkItem } from "@/data/types";
import { ActionButton } from "@/components/action/action-button";

/** One square in a tile row (icon + short label) bound to an action. */
export function ActionTile({ item }: { item: LinkItem }) {
  const { icon: Icon, label, action } = item;
  return (
    <ActionButton
      action={action}
      aria-label={label}
      className="flex flex-col items-center gap-2 rounded-2xl bg-paper-soft py-3.5 text-ink hover:brightness-110"
    >
      <Icon className="size-5" strokeWidth={1.6} />
      <span className="text-xs font-medium">{label}</span>
    </ActionButton>
  );
}

/** A responsive row of tiles. Column count follows the item count (3–5). */
export function ActionGrid({ items }: { items: LinkItem[] }) {
  return (
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <ActionTile key={item.label} item={item} />
      ))}
    </div>
  );
}
