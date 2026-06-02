# VisitProfile

A digital business card — a single, polished profile screen. One person's
photo, name, status, a booking CTA, contact actions, and a few "now" details,
all on a screen that **never scrolls**. It fills the viewport on mobile and
renders as a centred, full-height card on larger screens.

## Stack

| Concern    | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 — **Pages Router** (`pages/`)          |
| Language   | TypeScript                                        |
| Styling    | Tailwind CSS v4 (tokens in `styles/globals.css`)  |
| Components | shadcn/ui conventions (`cn()`, `components.json`) |
| Animation  | Framer Motion                                     |
| Icons      | lucide-react (+ custom brand icons)               |

> ⚠️ This repo pins **Next.js 16**, which has breaking changes vs. older
> versions. Read `node_modules/next/dist/docs/` before changing framework code.
> See `AGENTS.md`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Routes

The first user is the root (`/`); every profile is also served at its slug:
`/user1` … `/user8` (statically generated). Add a user in `data/users/`.

## How it's built

- **Data-driven.** Everything on screen comes from a `Profile` in
  `data/users/*`. Swap/extend it (or feed it from an API in the same shape) to
  render anyone.
- **Small, reusable components.** `components/profile/*` are presentational
  pieces (`ProfileHero`, `FeaturedCard`, `ActionTile`, `LinkRow`, `MetaRow`,
  `FooterActions`) composed by `ProfileCard`.
- **Themeable.** Six themes (`paper`, `mono`, `midnight`, `violet`, `sunset`,
  `forest`) plus shadows live in **one file**, `data/themes.ts`. Each profile
  picks one via its `theme` field. Add a theme by copying a block.
- **Readability control.** If a portrait clashes with the hero text, set a
  profile's `readability` (`none` / `shadow` / `scrim` / `plate`) — also in
  `data/themes.ts`.
- **One button, many behaviours.** Every tap uses `<ActionButton action={…}>`.
  An `Action` (`lib/actions.ts`) is interpreted by a single runner that adapts
  to the device:
  - `tel` / `sms` → native dialer on touch devices, reveal-in-sheet on desktop
  - `mailto` → mail client
  - `external` → new tab
  - `sheet` → bottom sheet (all in-app navigation)
  - `share` → Web Share on touch, copy-link sheet fallback
  - `vcard` → downloads a generated `.vcf`
- **Sheets for navigation.** A single animated bottom sheet
  (`components/ui/sheet.tsx`) is hosted by `ActionProvider`. Same on mobile and
  desktop for now.

## Layout contract

The home screen is intentionally **non-scrollable** (`body { overflow: hidden }`)
and the layout is the **same at every breakpoint** — only the framing changes
(full-bleed on mobile, centred card on desktop). Desktop-specific layouts are a
future change; keep them aligned for now.

## Notes

- Portraits and gallery images are **placeholders** (Unsplash, via
  `data/users/_assets.ts`). Replace the `src` values with real assets; allowed
  remote hosts are in `next.config.ts`.
- All buttons are wired but the destinations are illustrative. Lead-gen forms
  confirm locally — wire them to an API when ready.

Further reading: [`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md) ·
[`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md)
