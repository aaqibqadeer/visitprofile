# Coding Guidelines

Conventions for working in this repo. Keep changes consistent with these.

## Golden rules

1. **Read the framework docs first.** This is Next.js 16 with breaking changes.
   Consult `node_modules/next/dist/docs/` before touching framework code and
   heed deprecation notices (e.g. `<Image priority>` → `preload`).
2. **The home screen never scrolls.** `body` is `overflow: hidden`. Fit content;
   don't introduce page scroll. Only sheets scroll internally.
3. **Same layout at every breakpoint** (for now). Use responsive utilities for
   framing/sizing, not for restructuring the layout.

## Components

- **Small and single-purpose.** A component renders one thing. If it grows two
  responsibilities, split it. Prefer composition over flags.
- **Presentational by default.** Leaf components take props and render. No data
  fetching, no `window` side-effects, no business logic in them.
- **Data comes from `lib/profile.ts`.** Don't hard-code user-facing copy in
  components. Extend the `Profile` type when you add fields.
- **Naming.** Files `kebab-case.tsx`; components `PascalCase`; hooks `useThing`.
  One primary component per file (small helpers in the same file are fine).
- **Props.** Export a `…Props` type when non-trivial. Accept `className` and
  merge with `cn()` when a component is meant to be styled by its parent.

## Buttons & actions

- **Never put behaviour in a button.** Use `<ActionButton action={…}>`.
- **No raw `onClick` side-effects** (navigation, `window.open`, `tel:`, etc.) in
  UI components. Express it as an `Action` and let the runner handle it.
- **Add behaviours in two places only:** the `Action` union (`lib/actions.ts`)
  and the runner (`components/action/action-provider.tsx`).
- **Device differences live in the runner**, gated by `useIsTouch()` — not in
  components.
- **Navigation = a sheet.** Use `kind: "sheet"`; don't add ad-hoc modals.

## Styling

- Tailwind v4 utilities. Use the **design tokens** in `styles/globals.css`
  (`bg-paper`, `text-ink`, `text-ink-soft`, `font-serif`, …) rather than raw hex
  or arbitrary values. Add a token if you need a new brand value.
- Merge conditional classes with `cn()` from `lib/utils.ts`.
- Keep animations in Framer Motion; respect reduced-motion where practical.

## Icons

- Prefer `lucide-react`. lucide has **no brand icons** — add custom ones to
  `components/icons.tsx` using the shared `IconType` shape.

## TypeScript

- `strict` is on. No `any`; model data with explicit types/unions.
- Prefer discriminated unions (like `Action`) over boolean flags for variants.
- Import via the `@/` alias.

## Before committing

```bash
npx tsc --noEmit   # types
npm run lint       # eslint
npm run build      # full build (catches Image/route issues)
```

Commit small and descriptively. Don't commit `.next/` or `node_modules/`.
