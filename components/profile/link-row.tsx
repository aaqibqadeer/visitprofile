import { ChevronRight } from "lucide-react";
import type { LinkItem } from "@/data/types";
import { ActionButton } from "@/components/action/action-button";

/** A full-width row: icon + label (+ sublabel) + chevron, bound to an action. */
export function LinkRow({ item }: { item: LinkItem }) {
  const { icon: Icon, label, sublabel, action } = item;
  return (
    <ActionButton
      action={action}
      className="flex w-full items-center gap-3.5 rounded-2xl bg-paper-soft px-4 py-3 text-left text-ink hover:bg-paper-soft/70"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-paper text-ink">
        <Icon className="size-[18px]" strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{label}</span>
        {sublabel && (
          <span className="block truncate text-xs text-ink-soft">{sublabel}</span>
        )}
      </span>
      <ChevronRight className="size-4 shrink-0 text-ink-faint" />
    </ActionButton>
  );
}
