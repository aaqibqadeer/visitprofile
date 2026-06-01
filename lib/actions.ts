import type { ReactNode } from "react";

/**
 * Action layer
 * ------------
 * Buttons across the app are presentational. What they *do* is described by a
 * serialisable `Action`. A single runner (see `ActionProvider`) interprets the
 * action and adapts the behaviour to the device:
 *
 *   - `tel` / `sms`  → trigger the native handler on touch devices, otherwise
 *                       reveal the number/handle in a sheet (desktop has no
 *                       dialer).
 *   - `mailto`       → open the mail client (works everywhere).
 *   - `external`     → open a URL in a new tab.
 *   - `sheet`        → present arbitrary content in a bottom sheet. All
 *                       in-app "navigation" goes through sheets for now, on
 *                       both mobile and desktop.
 *   - `share`        → Web Share on touch devices, copy-link sheet fallback.
 *   - `vcard`        → download a generated .vcf contact.
 *
 * Adding a new behaviour = add a variant here + a case in the runner. Buttons
 * never change.
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
  | { kind: "mailto"; value: string }
  | { kind: "external"; href: string }
  | { kind: "sheet"; content: SheetContent }
  | { kind: "share"; data: SharePayload }
  | { kind: "vcard" }
  | { kind: "none" };

/** Capabilities the runner needs from its environment. */
export type ActionEnv = {
  /** Touch-first device (coarse pointer) — gets native dialer/share. */
  isTouch: boolean;
  openSheet: (content: SheetContent) => void;
  closeSheet: () => void;
};
