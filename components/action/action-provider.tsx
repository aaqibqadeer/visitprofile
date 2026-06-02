import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Action, SheetContent } from "@/lib/actions";
import { digits } from "@/lib/actions";
import type { Profile } from "@/data/types";
import { downloadUrl, downloadVCard } from "@/lib/vcard";
import { useIsTouch } from "@/lib/use-is-touch";
import { Sheet } from "@/components/ui/sheet";
import { SectionView } from "@/components/sections/section-view";

type ActionContextValue = {
  run: (action: Action) => void;
};

const ActionContext = createContext<ActionContextValue | null>(null);

/**
 * Hosts the single bottom sheet and the action runner. Wrap the card with it
 * and pass the active profile (used by vCard). Descendants call
 * `useAction().run(action)`.
 */
export function ActionProvider({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const isTouch = useIsTouch();
  const [sheet, setSheet] = useState<SheetContent | null>(null);

  const openSheet = useCallback((content: SheetContent) => setSheet(content), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const run = useCallback(
    (action: Action) => {
      switch (action.kind) {
        case "tel":
          go(isTouch, `tel:${action.value}`, () =>
            openSheet(contactSheet("Call", action.value, `tel:${action.value}`))
          );
          break;
        case "sms":
          go(isTouch, `sms:${action.value}`, () =>
            openSheet(contactSheet("Message", action.value, `sms:${action.value}`))
          );
          break;
        case "facetime":
          go(isTouch, `facetime:${action.value}`, () =>
            openSheet(contactSheet("FaceTime", action.value, `facetime:${action.value}`))
          );
          break;
        case "whatsapp": {
          const url = `https://wa.me/${digits(action.value)}${
            action.text ? `?text=${encodeURIComponent(action.text)}` : ""
          }`;
          window.open(url, "_blank", "noopener,noreferrer");
          break;
        }
        case "mailto":
          window.location.href = `mailto:${action.value}${
            action.subject ? `?subject=${encodeURIComponent(action.subject)}` : ""
          }`;
          break;
        case "external":
          window.open(action.href, "_blank", "noopener,noreferrer");
          break;
        case "download":
          downloadUrl(action.href, action.filename);
          break;
        case "maps":
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(action.query)}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;
        case "section":
          openSheet({
            title: action.section.title,
            description: action.section.description,
            body: <SectionView section={action.section} />,
          });
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
    [isTouch, openSheet, profile]
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

/** On touch devices follow the native URL; otherwise run the fallback. */
function go(isTouch: boolean, href: string, fallback: () => void) {
  if (isTouch) window.location.href = href;
  else fallback();
}

/** Desktop fallback for tel/sms/facetime: reveal the handle. */
function contactSheet(title: string, value: string, href: string): SheetContent {
  return {
    title,
    description: "No native handler here — use the details below.",
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
