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

## How it's built

- **Data-driven.** Everything on screen comes from `lib/profile.ts`. Swap that
  object (or feed it from an API in the same shape) to render anyone.
- **Small, reusable components.** `components/profile/*` are presentational
  pieces (`ProfileHero`, `BookingCard`, `ActionTile`, `MetaRow`,
  `FooterActions`) composed by `ProfileCard`.
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

- The portrait in `lib/profile.ts` is a **placeholder** (Unsplash). Replace
  `photo.src` with the real asset; allowed remote hosts are in `next.config.ts`.
- All buttons are wired but the destinations are illustrative.

Further reading: [`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md) ·
[`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md)
