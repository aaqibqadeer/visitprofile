import type { Action } from "@/lib/actions";
import type { IconType } from "@/components/icons";
import type { ThemeName } from "./themes";
import type { ReadabilityMode } from "./themes";

/**
 * Domain types for a profile. Everything rendered on screen is described here
 * and lives in `data/users/*`. Components read these shapes — they never embed
 * copy or behaviour of their own.
 */

/** A tappable item: icon + label (+ optional sublabel) bound to an Action. */
export type LinkItem = {
  icon: IconType;
  label: string;
  sublabel?: string;
  action: Action;
};

/** Known social networks (drive icon + label + accent). */
export type SocialNetwork =
  | "instagram"
  | "facebook"
  | "x"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "github"
  | "dribbble"
  | "behance"
  | "whatsapp";

export type SocialItem = {
  network: SocialNetwork;
  /** @handle or display name. */
  handle: string;
  action: Action;
};

export type MetaItem = {
  label: string;
  value: string;
  dot?: boolean;
  serif?: boolean;
  external?: boolean;
  /** Optional: tapping the meta value runs an action (e.g. opens a sheet). */
  action?: Action;
};

/* ── Sheet sections ───────────────────────────────────────────────────────
   Structured, serialisable content rendered by <SectionView> inside a sheet.
   Add a section type here + a branch in SectionView to support new content. */

export type InfoBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "stat"; label: string; value: string }
  | { kind: "quote"; text: string; by?: string };

export type GalleryImage = { src: string; alt: string };

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required?: boolean;
};

export type Section =
  | { type: "social"; title: string; description?: string; items: SocialItem[] }
  | { type: "links"; title: string; description?: string; items: LinkItem[] }
  | { type: "info"; title: string; description?: string; blocks: InfoBlock[] }
  | { type: "gallery"; title: string; description?: string; images: GalleryImage[] }
  | {
      type: "form";
      title: string;
      description?: string;
      fields: FormField[];
      submitLabel?: string;
    };

/** The full profile. */
export type Profile = {
  slug: string;
  theme: ThemeName;
  /** How hero text stays legible over the photo. Tune per profile. */
  readability: ReadabilityMode;

  monogram: string;
  availability?: string;
  name: { first: string; last: string };
  role: string;
  company: string;
  tagline: string;
  location: string;
  timezone: string;
  photo: { src: string; alt: string };

  /** Raw contact details (also used for the generated vCard). */
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };

  /** Featured call-to-action (the dark card). Optional. */
  featured?: LinkItem;
  /** The compact contact tiles row (keep to ~4–5 to stay non-scrolling). */
  contacts: LinkItem[];
  /** Secondary buttons that open sheets (Social, Links, About, Gallery…). */
  shortcuts: LinkItem[];
  /** The Now / Reading / Notes strip. */
  meta: MetaItem[];
};
