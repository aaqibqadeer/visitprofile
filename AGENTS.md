<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: VisitProfile

A digital business-card / profile screen. Single, non-scrolling screen that
fills the viewport on mobile and renders as a centred, full-height card on
wider screens. **The layout is identical across breakpoints** — only the
framing changes. Desktop-specific layouts may come later; do not diverge the
layout now.

## Stack

- Next.js 16 (**Pages Router**, `pages/`), TypeScript
- Tailwind CSS v4 (config-less; tokens live in `styles/globals.css` `@theme`)
- shadcn/ui conventions (`cn()` in `lib/utils.ts`, `components.json`)
- Framer Motion (sheet + entrance animation)
- lucide-react for icons (brand icons live in `components/icons.tsx`)

## Read before coding

`node_modules/next/dist/docs/` — this Next.js has breaking changes. Notably:
`<Image priority>` is deprecated in favour of `preload`; remote images use the
`new URL()` shorthand in `next.config.ts` `images.remotePatterns`.

See `docs/PROJECT_GUIDE.md` for architecture and `docs/CODING_GUIDELINES.md`
for conventions. Follow them.

## Where things live

- **Content & theming:** `data/` — `data/users/*` (one `Profile` each, served at
  `/<slug>`), `data/themes.ts` (themes + readability, the one file to re-skin),
  `data/types.ts` (domain types).
- **Behaviour:** `lib/actions.ts` (Action union + `A.*` factories), the runner in
  `components/action/action-provider.tsx`.
- **UI:** `components/profile/*` (home pieces), `components/sections/*` (sheet
  content), `components/ui/sheet.tsx`, `components/icons.tsx` (brand glyphs).

## Non-negotiables

- **Keep the home screen non-scrollable.** `body` is `overflow: hidden`; fit
  content, don't add scroll. Long lists/catalogues go in **sheets**, not on the
  home column. Sheets manage their own scroll.
- **Same layout at every width** — full-bleed mobile, centred **full-height**
  column on desktop, flush edges (no rounded "phone" frame). Don't restructure
  per breakpoint.
- **Components stay small and presentational.** One responsibility each, props
  in, no data fetching inside leaf components. Copy/data comes from
  `data/users/*`; never hard-code user-facing copy in components.
- **Style via theme tokens** (`bg-paper`, `text-ink`, `bg-accent`, …) defined in
  `data/themes.ts` — not raw hex. Add a token/theme there if you need one.
- **Buttons never encode behaviour.** Use `<ActionButton action={…}>`. To add a
  behaviour, add an `Action` variant in `lib/actions.ts` and a case in the
  runner (`components/action/action-provider.tsx`) — never wire `onClick`
  side-effects into UI components.
- **All in-app navigation goes through sheets** (mobile and desktop, for now).
- Run `npx tsc --noEmit` and `npm run build` before committing.
