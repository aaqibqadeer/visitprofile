import { ArrowUpRight } from "lucide-react";
import type { LinkItem } from "@/data/types";
import { ActionButton } from "@/components/action/action-button";

/** The dark featured call-to-action (e.g. "Book a meeting"). */
export function FeaturedCard({ item }: { item: LinkItem }) {
  const { icon: Icon, label, sublabel, action } = item;
  return (
    <ActionButton
      action={action}
      className="flex w-full items-center gap-4 rounded-2xl bg-surface px-4 py-3.5 text-left text-surface-ink hover:opacity-95"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{label}</span>
        {sublabel && (
          <span className="block truncate text-sm opacity-60">{sublabel}</span>
        )}
      </span>
      <ArrowUpRight className="size-5 shrink-0 opacity-70" />
    </ActionButton>
  );
}
