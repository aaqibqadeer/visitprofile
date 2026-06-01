# Project Guide

How VisitProfile fits together and why.

## The screen

One non-scrolling screen: a portrait hero that fades into a "paper" panel
holding a booking CTA, four contact tiles, a meta strip (Now / Reading / Notes),
and a footer (Share / QR / Save vCard). Same layout at every width — full-bleed
on mobile, a centred phone-width card on desktop.

## Directory map

```
pages/
  _app.tsx              Global CSS only.
  _document.tsx         Default document.
  index.tsx             Stage + card frame; mounts ActionProvider + ProfileCard.

lib/
  profile.ts            Single source of truth for all displayed data + types.
  actions.ts            Action union + runner environment types.
  vcard.ts              vCard string builder + client download.
  use-is-touch.ts       Coarse-pointer detection (SSR-safe).
  utils.ts              cn() class merger (shadcn convention).

components/
  action/
    action-provider.tsx Hosts the sheet + the single action runner (useAction).
    action-button.tsx   Presentational button bound to an Action.
  ui/
    sheet.tsx           Animated bottom sheet (Framer Motion).
    button.tsx          shadcn button (available for future use).
  profile/
    profile-card.tsx    Composition: maps profile data → actions → layout.
    profile-hero.tsx    Portrait + monogram + status + name block.
    monogram.tsx        "M·O" mark.
    status-badge.tsx    "Available · Q3" pill.
    booking-card.tsx    Dark "Book a meeting" CTA.
    action-tile.tsx     ActionTile + ActionGrid (Call/Email/Message/LinkedIn).
    meta-row.tsx        Now / Reading / Notes strip.
    footer-actions.tsx  Share / QR / Save vCard.
  icons.tsx             IconType + custom brand icons (LinkedIn).

styles/globals.css      Tailwind v4 import + design tokens (@theme).
```

## Data flow

```
lib/profile.ts ──▶ ProfileCard ──┬─▶ presentational components (display)
                                 └─▶ Action objects ─▶ <ActionButton>
                                                          │ run(action)
                                          ActionProvider runner
                                          ├─ native (tel/sms/mailto/share)
                                          ├─ new tab (external)
                                          ├─ download (vcard)
                                          └─ openSheet(...) ─▶ <Sheet>
```

`ProfileCard` is the only place that knows both the data and the actions. Leaf
components receive plain props and an `Action` where they're tappable; they
never decide what happens.

## The action layer

A button's behaviour is **data**, not code. `Action` (`lib/actions.ts`) is a
discriminated union; the runner in `ActionProvider` interprets it and adapts to
the device (`useIsTouch`). This keeps one `ActionButton` reusable everywhere and
makes "what does this do?" answerable by reading data.

Add a behaviour:

1. Add a variant to the `Action` union in `lib/actions.ts`.
2. Handle it in the `switch` inside `ActionProvider`.
3. Use it: `<ActionButton action={{ kind: "yourKind", … }}>`.

Device adaptation lives in the runner, never in components — e.g. `tel` dials on
touch devices and reveals the number in a sheet on desktop.

## Sheets & navigation

There is one `Sheet`, hosted by `ActionProvider` and rendered inside the card so
it's clipped to the card column on desktop. All in-app navigation is an action
of `kind: "sheet"` carrying its content. Mobile and desktop share this for now.

## Layout & non-scroll

- `body { overflow: hidden }` (in `globals.css`) enforces the no-scroll rule.
- `pages/index.tsx` sizes the card with `h-[100svh]` (mobile) →
  `sm:h-[min(100svh,880px)] sm:w-[420px]` (desktop).
- The hero uses `flex-1 min-h-0` so it absorbs spare height; the panel below is
  `shrink-0`. Content is tuned to fit — if you add to it, keep it fitting.

## Styling

Tailwind v4, config-less. Design tokens (`--color-paper`, `--color-ink`,
`--font-serif`, …) are declared in the `@theme` block of `styles/globals.css`
and used as utilities (`bg-paper`, `text-ink`, `font-serif`). Fonts are system
stacks (no network dependency); swap to `next/font` if a brand face is needed.
