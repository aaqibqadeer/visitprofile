/**
 * THEMES & READABILITY  ── the one file to tune the look ──────────────────────
 *
 * Each theme is a flat map of CSS custom properties applied to the card root
 * (see <ProfileCard>). Tailwind utilities like `bg-paper` / `text-ink` read
 * these vars, so switching a theme re-skins everything with no component edits.
 *
 * To add a theme: copy a block below, change the values, done. To change a
 * profile's theme: set `theme` in its data file (`data/users/*`).
 *
 * READABILITY: when the portrait clashes with the hero text, turn on a
 * highlight mode per profile (`readability` field). Modes are defined at the
 * bottom and applied to each hero text field.
 */

export type ThemeTokens = {
  /** Panel / page surface. */
  paper: string;
  paperSoft: string;
  paperLine: string;
  /** Foreground text shades. */
  ink: string;
  inkSoft: string;
  inkFaint: string;
  /** Dark feature surface (booking card, etc.) + its text. */
  surface: string;
  surfaceInk: string;
  /** Accent (status dot, "now" indicator, links). */
  accent: string;
  accentInk: string;
  /** Backdrop behind the card on wide screens. */
  stage: string;
  /** Box-shadow used to lift the card off the stage. */
  shadow: string;
};

export type Theme = {
  label: string;
  tokens: ThemeTokens;
};

export const themes = {
  /** Warm editorial paper — the default. */
  paper: {
    label: "Paper",
    tokens: {
      paper: "#efe9df",
      paperSoft: "#f4efe7",
      paperLine: "#ddd5c7",
      ink: "#211f1b",
      inkSoft: "#6f6a60",
      inkFaint: "#9a958a",
      surface: "#221f1b",
      surfaceInk: "#f4efe7",
      accent: "#5fbf8a",
      accentInk: "#0d1f15",
      stage: "#0c0b0a",
      shadow: "0 24px 70px -24px rgba(0,0,0,0.55)",
    },
  },

  /** High-contrast black & white, Vercel/Next.js style. */
  mono: {
    label: "Mono",
    tokens: {
      paper: "#ffffff",
      paperSoft: "#f4f4f5",
      paperLine: "#e4e4e7",
      ink: "#09090b",
      inkSoft: "#52525b",
      inkFaint: "#a1a1aa",
      surface: "#09090b",
      surfaceInk: "#fafafa",
      accent: "#171717",
      accentInk: "#ffffff",
      stage: "#000000",
      shadow: "0 24px 70px -28px rgba(0,0,0,0.8)",
    },
  },

  /** Inky dark mode with soft contrast. */
  midnight: {
    label: "Midnight",
    tokens: {
      paper: "#15161a",
      paperSoft: "#1d1f25",
      paperLine: "#2c2f37",
      ink: "#f3f4f6",
      inkSoft: "#a8adba",
      inkFaint: "#6c717e",
      surface: "#f3f4f6",
      surfaceInk: "#15161a",
      accent: "#7dd3fc",
      accentInk: "#06283a",
      stage: "#000000",
      shadow: "0 24px 80px -24px rgba(0,0,0,0.9)",
    },
  },

  /** Violet — vivid accent on a near-white panel. */
  violet: {
    label: "Violet",
    tokens: {
      paper: "#faf8ff",
      paperSoft: "#f1ecff",
      paperLine: "#e2d9fb",
      ink: "#1e1633",
      inkSoft: "#5b5176",
      inkFaint: "#9a8fbb",
      surface: "#6d28d9",
      surfaceInk: "#f5f3ff",
      accent: "#7c3aed",
      accentInk: "#ffffff",
      stage: "#0f0a1f",
      shadow: "0 24px 80px -24px rgba(76,29,149,0.55)",
    },
  },

  /** Warm sunset clay. */
  sunset: {
    label: "Sunset",
    tokens: {
      paper: "#fff3ec",
      paperSoft: "#ffe7da",
      paperLine: "#f6d2c1",
      ink: "#3a1d12",
      inkSoft: "#8a5642",
      inkFaint: "#bd9080",
      surface: "#c2410c",
      surfaceInk: "#fff3ec",
      accent: "#ea580c",
      accentInk: "#ffffff",
      stage: "#1a0d07",
      shadow: "0 24px 80px -24px rgba(154,52,18,0.5)",
    },
  },

  /**
   * Ajrak — inspired by the traditional block-printing craft of Sindh.
   * Deep crimson red, near-black ink, aged ivory paper, and burnished gold accents.
   */
  ajrak: {
    label: "Ajrak",
    tokens: {
      paper: "#f5ede3",
      paperSoft: "#ecddd0",
      paperLine: "#d6beaa",
      ink: "#1a0a06",
      inkSoft: "#5c3020",
      inkFaint: "#9a6650",
      surface: "#8b1a1a",
      surfaceInk: "#fdf3ec",
      accent: "#c0392b",
      accentInk: "#ffffff",
      stage: "#0d0403",
      shadow: "0 28px 80px -20px rgba(100,10,10,0.65)",
    },
  },

  /** Deep forest / emerald. */
  forest: {
    label: "Forest",
    tokens: {
      paper: "#f0f5f0",
      paperSoft: "#e3efe5",
      paperLine: "#cadfce",
      ink: "#16241b",
      inkSoft: "#4f6a58",
      inkFaint: "#8aa593",
      surface: "#14532d",
      surfaceInk: "#ecfdf3",
      accent: "#15803d",
      accentInk: "#ffffff",
      stage: "#08130c",
      shadow: "0 24px 80px -24px rgba(6,46,24,0.5)",
    },
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

/** Turn a theme into the inline CSS-variable style applied to the card root. */
export function themeStyle(name: ThemeName): React.CSSProperties {
  const t = themes[name].tokens;
  return {
    "--color-paper": t.paper,
    "--color-paper-soft": t.paperSoft,
    "--color-paper-line": t.paperLine,
    "--color-ink": t.ink,
    "--color-ink-soft": t.inkSoft,
    "--color-ink-faint": t.inkFaint,
    "--color-surface": t.surface,
    "--color-surface-ink": t.surfaceInk,
    "--color-accent": t.accent,
    "--color-accent-ink": t.accentInk,
    "--color-stage": t.stage,
    "--card-shadow": t.shadow,
  } as React.CSSProperties;
}

/* ── Readability ─────────────────────────────────────────────────────────── */

/**
 * How hero text is kept legible over the photo:
 *  - "none"   no treatment (use when the photo has clear, calm areas)
 *  - "shadow" soft text shadow / glow
 *  - "scrim"  gradient already fades the photo; rely on it
 *  - "plate"  translucent rounded plate behind each text field (strongest)
 */
export type ReadabilityMode = "none" | "shadow" | "scrim" | "plate";

/** Classes applied to each hero text field for the chosen mode. */
export function readabilityClass(mode: ReadabilityMode): string {
  switch (mode) {
    case "shadow":
      return "[text-shadow:0_1px_12px_rgba(0,0,0,0.45)]";
    case "plate":
      return "rounded-lg bg-paper/55 px-2 py-0.5 backdrop-blur-[2px] [box-decoration-break:clone]";
    case "scrim":
    case "none":
    default:
      return "";
  }
}
