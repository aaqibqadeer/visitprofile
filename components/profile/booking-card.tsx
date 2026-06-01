import { ArrowUpRight, Calendar } from "lucide-react";
import type { Action } from "@/lib/actions";
import { ActionButton } from "@/components/action/action-button";

/** The dark "Book a meeting" call-to-action. */
export function BookingCard({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action: Action;
}) {
  return (
    <ActionButton
      action={action}
      className="flex w-full items-center gap-4 rounded-2xl bg-surface-dark px-4 py-3.5 text-left text-white hover:bg-surface-dark/90"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
        <Calendar className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{title}</span>
        <span className="block truncate text-sm text-white/60">{detail}</span>
      </span>
      <ArrowUpRight className="size-5 shrink-0 text-white/70" />
    </ActionButton>
  );
}
