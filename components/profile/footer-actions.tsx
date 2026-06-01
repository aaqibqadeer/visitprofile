import type { Action } from "@/lib/actions";
import type { IconType } from "@/components/icons";
import { ActionButton } from "@/components/action/action-button";

export type FooterAction = {
  icon: IconType;
  label: string;
  action: Action;
};

/** The "Share · QR · Save vCard" footer. */
export function FooterActions({ actions }: { actions: FooterAction[] }) {
  return (
    <div className="flex items-center justify-center gap-1 text-ink-soft">
      {actions.map((item, i) => (
        <div key={item.label} className="flex items-center">
          {i > 0 && <span className="px-2 text-ink-faint">·</span>}
          <ActionButton
            action={item.action}
            className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] hover:text-ink"
          >
            <item.icon className="size-4" strokeWidth={1.6} />
            {item.label}
          </ActionButton>
        </div>
      ))}
    </div>
  );
}
