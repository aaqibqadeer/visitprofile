import type { Action } from "@/lib/actions";
import type { IconType } from "@/components/icons";
import { ActionButton } from "@/components/action/action-button";

export type ActionTileProps = {
  icon: IconType;
  label: string;
  action: Action;
};

/** One square in the contact row (Call / Email / Message / LinkedIn). */
export function ActionTile({ icon: Icon, label, action }: ActionTileProps) {
  return (
    <ActionButton
      action={action}
      aria-label={label}
      className="flex flex-col items-center gap-2 rounded-2xl bg-paper-soft py-3.5 text-ink hover:bg-white"
    >
      <Icon className="size-5" strokeWidth={1.6} />
      <span className="text-xs font-medium">{label}</span>
    </ActionButton>
  );
}

/** The 4-up grid of contact tiles. */
export function ActionGrid({ tiles }: { tiles: ActionTileProps[] }) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {tiles.map((tile) => (
        <ActionTile key={tile.label} {...tile} />
      ))}
    </div>
  );
}
