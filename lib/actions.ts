import type { ReactNode } from "react";
import type { Section } from "@/data/types";

/**
 * Action layer
 * ------------
 * A button's behaviour is described by a serialisable `Action`. One runner
 * (see `ActionProvider`) interprets it and adapts to the device. Buttons stay
 * presentational; to add a behaviour, add a variant + a runner case + (option-
 * ally) a factory below.
 */

export type SheetContent = {
  title?: string;
  description?: string;
  body: ReactNode;
};

export type SharePayload = {
  title: string;
  text?: string;
  url: string;
};

export type Action =
  | { kind: "tel"; value: string }
  | { kind: "sms"; value: string }
  | { kind: "facetime"; value: string }
  | { kind: "whatsapp"; value: string; text?: string }
  | { kind: "mailto"; value: string; subject?: string }
  | { kind: "external"; href: string }
  | { kind: "download"; href: string; filename?: string }
  | { kind: "maps"; query: string }
  | { kind: "section"; section: Section }
  | { kind: "sheet"; content: SheetContent }
  | { kind: "share"; data: SharePayload }
  | { kind: "vcard" }
  | { kind: "none" };

/** Capabilities the runner needs from its environment. */
export type ActionEnv = {
  isTouch: boolean;
  openSheet: (content: SheetContent) => void;
  closeSheet: () => void;
};

/* ── Factories ─────────────────────────────────────────────────────────────
   Terse helpers so user data files read cleanly: `A.whatsapp("+1…")`. */
export const A = {
  tel: (value: string): Action => ({ kind: "tel", value }),
  sms: (value: string): Action => ({ kind: "sms", value }),
  facetime: (value: string): Action => ({ kind: "facetime", value }),
  whatsapp: (value: string, text?: string): Action => ({ kind: "whatsapp", value, text }),
  mailto: (value: string, subject?: string): Action => ({ kind: "mailto", value, subject }),
  external: (href: string): Action => ({ kind: "external", href }),
  download: (href: string, filename?: string): Action => ({ kind: "download", href, filename }),
  maps: (query: string): Action => ({ kind: "maps", query }),
  section: (section: Section): Action => ({ kind: "section", section }),
  sheet: (content: SheetContent): Action => ({ kind: "sheet", content }),
  share: (data: SharePayload): Action => ({ kind: "share", data }),
  vcard: (): Action => ({ kind: "vcard" }),
  none: (): Action => ({ kind: "none" }),
};

/** Strip a phone number down to wa.me-friendly digits. */
export function digits(value: string): string {
  return value.replace(/[^\d]/g, "");
}
