import { cn } from "@/lib/utils";
import type { Action } from "@/lib/actions";
import { useAction } from "./action-provider";

export type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** What this button does. The runner adapts behaviour to the device. */
  action: Action;
};

/**
 * Presentational button bound to an `Action`. Use it anywhere a tap should do
 * something — tiles, links, the booking card, the footer. Styling comes from
 * `className`/children so the same component serves every surface.
 */
export function ActionButton({ action, className, children, ...props }: ActionButtonProps) {
  const { run } = useAction();
  return (
    <button
      type="button"
      onClick={() => run(action)}
      className={cn(
        "outline-none transition-[transform,background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-ink/30 active:scale-[0.97]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
