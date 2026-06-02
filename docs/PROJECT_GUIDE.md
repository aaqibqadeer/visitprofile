# Project Guide

How VisitProfile fits together and why.

## The screen

One non-scrolling screen per profile: a portrait hero that fades into a "paper"
panel holding a featured CTA, a row of contact tiles, shortcut rows that open
sheets, a meta strip, and a footer. Same layout at every width — full-bleed on
mobile, a centred **full-height** column on desktop (flush edges, no rounded
"phone" frame).

The long catalogues (every social network, link, info page, gallery, lead form)
do **not** live on the home screen — that would force scrolling. They live in
**sheets** opened from the shortcut rows. Home stays fixed-height.

## Directory map

```
data/                         ── all content + theming (the things you edit most)
  types.ts                    Profile, LinkItem, SocialItem, MetaItem, Section…
  themes.ts                   THEMES + READABILITY. One file to re-skin.
  users/
    index.ts                  Registry: slug → Profile, getUser, getAllSlugs.
    _assets.ts                Placeholder image helpers.
    maya.ts … kai.ts          8 example users (served at /user1 … /user8).

lib/
  actions.ts                  Action union + `A` factories + helpers.
  socials.ts                  SocialNetwork → { label, icon }.
  vcard.ts                    vCard builder + file downloads.
  use-is-touch.ts             Coarse-pointer detection (SSR-safe).
  utils.ts                    cn().

components/
  action/
    action-provider.tsx       Hosts the sheet + the single action runner.
    action-button.tsx         Presentational button bound to an Action.
  profile/
    profile-screen.tsx        Stage + themed full-height frame + provider.
    profile-card.tsx          Composition of the home column.
    profile-hero.tsx          Portrait + monogram + status + name (readability).
    featured-card.tsx         Dark featured CTA.
    action-tile.tsx           Contact tiles row.
    link-row.tsx              Full-width icon + title row (reused in sheets).
    meta-row.tsx, monogram.tsx, status-badge.tsx, footer-actions.tsx
  sections/                   Sheet content renderers (one per Section type)
    section-view.tsx          Dispatch by section.type.
    social-section.tsx  links-section.tsx  info-section.tsx
    gallery-section.tsx form-section.tsx
  ui/
    sheet.tsx                 Animated, scrollable bottom sheet (Framer Motion).
    button.tsx                shadcn button (spare).
  icons.tsx                   IconType + custom brand glyphs (lucide has none).

pages/
  index.tsx                   Root → first user.
  [slug].tsx                  /user1 … /user8 (SSG; slug in, profile from registry).

styles/globals.css            Tailwind v4 import + token defaults + non-scroll body.
```

## Data flow

```
data/users/* (Profile) ──▶ ProfileScreen ──▶ ProfileCard ──┬─▶ display components
                                                           └─▶ Action objects
                                                                 │ run(action)
                                              ActionProvider runner
                                              ├─ native (tel/sms/facetime/whatsapp/mailto)
                                              ├─ new tab (external) / download / maps
                                              ├─ vcard / share
                                              └─ openSheet ─▶ <Sheet> ─▶ <SectionView>
```

A profile never JSON-travels through `getStaticProps` (it holds icon
*components*). `[slug].tsx` passes only the slug and resolves the profile from
the bundled registry at render — at build and on the client alike.

## The action layer

A button's behaviour is **data** (`Action`, `lib/actions.ts`), interpreted by
one runner in `ActionProvider` that adapts to the device (`useIsTouch`). Use the
`A.*` factories in data files. Add a behaviour in three steps:

1. Add a variant to the `Action` union.
2. Handle it in the runner's `switch`.
3. (Optional) add an `A.*` factory.

Device adaptation lives only in the runner (e.g. `tel` dials on touch, reveals
the number in a sheet on desktop).

## Sheets & sections

One `Sheet` (scrollable, animated) is hosted by `ActionProvider` inside the card
so it's clipped to the column on desktop. Structured content is described by a
`Section` (serialisable) and rendered by `SectionView`. Types today: `social`,
`links`, `info`, `gallery`, `form`. Add a type = extend the `Section` union +
add a branch in `SectionView`.

## Theming (data/themes.ts)

Each theme is a flat map of CSS custom properties (`paper`, `ink`, `surface`,
`accent`, `stage`, `shadow`…). `themeStyle(name)` turns it into inline CSS vars
applied on the screen root; Tailwind utilities (`bg-paper`, `text-ink`,
`bg-accent`) read those vars, so switching a theme re-skins everything with zero
component edits. A profile picks its theme via the `theme` field. Bundled
themes: `paper`, `mono`, `midnight`, `violet`, `sunset`, `forest`. Add one by
copying a block.

## Readability

When the portrait clashes with the hero text, set the profile's `readability`:
`none` | `shadow` (text glow) | `scrim` (rely on the gradient) | `plate`
(translucent plate behind each field — strongest). Implemented by
`readabilityClass()` and applied to every hero text field.

## Layout & non-scroll

- `body { overflow: hidden }` enforces the no-scroll rule.
- The frame is `h-[100svh]` (full height at every width), `sm:w-[440px]`, flush
  edges, lifted by the theme's `--card-shadow`.
- The hero is `flex-1 min-h-0`; the panel is `shrink-0`. Keep added content
  fitting — overflow belongs in a sheet.
