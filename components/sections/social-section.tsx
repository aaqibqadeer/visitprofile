import type { Section } from "@/data/types";
import { socialMeta } from "@/lib/socials";
import { ActionButton } from "@/components/action/action-button";

type SocialSec = Extract<Section, { type: "social" }>;

/** Grid of social networks shown inside the "Social" sheet. */
export function SocialSection({ section }: { section: SocialSec }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {section.items.map((item) => {
        const meta = socialMeta[item.network];
        const Icon = meta.icon;
        return (
          <ActionButton
            key={item.network}
            action={item.action}
            aria-label={meta.label}
            className="flex flex-col items-center gap-2 rounded-2xl bg-paper-soft px-2 py-4 text-ink hover:brightness-110"
          >
            <Icon className="size-6" />
            <span className="max-w-full truncate text-xs font-medium">{meta.label}</span>
            <span className="max-w-full truncate text-[11px] text-ink-faint">{item.handle}</span>
          </ActionButton>
        );
      })}
    </div>
  );
}
