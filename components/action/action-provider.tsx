import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Action, SheetContent } from "@/lib/actions";
import { profile } from "@/lib/profile";
import { downloadVCard } from "@/lib/vcard";
import { useIsTouch } from "@/lib/use-is-touch";
import { Sheet } from "@/components/ui/sheet";

type ActionContextValue = {
  run: (action: Action) => void;
};

const ActionContext = createContext<ActionContextValue | null>(null);

/**
 * Hosts the single bottom sheet and the action runner. Any descendant can call
 * `useAction().run(action)` to perform a device-adaptive behaviour.
 */
export function ActionProvider({ children }: { children: React.ReactNode }) {
  const isTouch = useIsTouch();
  const [sheet, setSheet] = useState<SheetContent | null>(null);

  const openSheet = useCallback((content: SheetContent) => setSheet(content), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const run = useCallback(
    (action: Action) => {
      switch (action.kind) {
        case "tel":
          if (isTouch) window.location.href = `tel:${action.value}`;
          else openSheet(contactSheet("Call", action.value, `tel:${action.value}`));
          break;
        case "sms":
          if (isTouch) window.location.href = `sms:${action.value}`;
          else openSheet(contactSheet("Message", action.value, `sms:${action.value}`));
          break;
        case "mailto":
          window.location.href = `mailto:${action.value}`;
          break;
        case "external":
          window.open(action.href, "_blank", "noopener,noreferrer");
          break;
        case "sheet":
          openSheet(action.content);
          break;
        case "share":
          if (isTouch && typeof navigator !== "undefined" && navigator.share) {
            void navigator.share(action.data).catch(() => {});
          } else {
            openSheet(shareSheet(action.data.url));
          }
          break;
        case "vcard":
          downloadVCard(profile);
          break;
        case "none":
          break;
      }
    },
    [isTouch, openSheet]
  );

  const value = useMemo(() => ({ run }), [run]);

  return (
    <ActionContext.Provider value={value}>
      {children}
      <Sheet
        open={sheet !== null}
        onClose={closeSheet}
        title={sheet?.title}
        description={sheet?.description}
      >
        {sheet?.body}
      </Sheet>
    </ActionContext.Provider>
  );
}

export function useAction(): ActionContextValue {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error("useAction must be used within <ActionProvider>");
  return ctx;
}

/** Desktop fallback for tel/sms: show the handle with a clickable link. */
function contactSheet(title: string, value: string, href: string): SheetContent {
  return {
    title,
    description: "No dialer here — reach out using the details below.",
    body: (
      <a
        href={href}
        className="block rounded-2xl bg-paper px-5 py-4 text-center font-serif text-2xl text-ink"
      >
        {value}
      </a>
    ),
  };
}

/** Desktop fallback for share: copy the link. */
function shareSheet(url: string): SheetContent {
  return {
    title: "Share profile",
    body: (
      <button
        onClick={() => void navigator.clipboard?.writeText(url)}
        className="w-full truncate rounded-2xl bg-paper px-5 py-4 text-left text-sm text-ink-soft transition-colors hover:text-ink"
      >
        {url}
        <span className="mt-1 block text-xs text-ink-faint">Tap to copy link</span>
      </button>
    ),
  };
}
