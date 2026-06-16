/**
 * Serializable "draft" type tree for the admin panel.
 *
 * Every place the live `Profile` uses `icon: IconType` (a React component),
 * `ProfileDraft` uses `iconKey: IconKey` (a plain string). A registry in
 * `lib/icon-registry.ts` maps keys back to components at render time.
 *
 * All other fields are structurally identical to the live types in `data/types.ts`.
 * Components never consume these types directly — `resolveProfile()` converts
 * a draft into a live `Profile` before it reaches any component.
 */

import type { SharePayload } from "@/lib/actions";
import type { ThemeName, ReadabilityMode } from "@/data/themes";
import type {
  SocialItem,
  MetaItem,
  InfoBlock,
  GalleryImage,
  FormField,
  StoryBlock,
  Badge,
} from "@/data/types";

// Re-export so consumers only need to import from draft-types
export type { Badge, BadgeContent, BadgeSize } from "@/data/types";

/* ── Icon keys ────────────────────────────────────────────────────────────── */

export type IconKey =
  // Lucide icons
  | "Phone"
  | "Mail"
  | "MessageSquare"
  | "Globe"
  | "FileText"
  | "Star"
  | "Briefcase"
  | "Users"
  | "HelpCircle"
  | "Calendar"
  | "Video"
  | "Download"
  | "BookOpen"
  | "Music"
  | "Mic"
  | "Ticket"
  | "Map"
  | "MapPin"
  | "Image"
  | "Images"
  | "Camera"
  | "ShoppingBag"
  | "Utensils"
  | "Clock"
  | "CreditCard"
  // Brand icons (from components/icons.tsx)
  | "LinkedInIcon"
  | "InstagramIcon"
  | "FacebookIcon"
  | "XIcon"
  | "YouTubeIcon"
  | "TikTokIcon"
  | "WhatsAppIcon"
  | "GitHubIcon"
  | "DribbbleIcon"
  | "BehanceIcon";

/* ── Serializable action ──────────────────────────────────────────────────── */

// Circular via SectionDraft.links.items.action — TypeScript handles this.
export type ActionDraft =
  | { kind: "tel"; value: string }
  | { kind: "sms"; value: string }
  | { kind: "facetime"; value: string }
  | { kind: "whatsapp"; value: string; text?: string }
  | { kind: "mailto"; value: string; subject?: string }
  | { kind: "external"; href: string }
  | { kind: "download"; href: string; filename?: string }
  | { kind: "maps"; query: string }
  | { kind: "section"; section: SectionDraft }
  | { kind: "share"; data: SharePayload }
  | { kind: "vcard" }
  | { kind: "none" };
// NOTE: "sheet" is internal/runtime only (contains ReactNode) — never in drafts.

/* ── Serializable section ─────────────────────────────────────────────────── */

export type SectionDraft =
  | { type: "social"; title: string; description?: string; items: SocialItem[] }
  | { type: "links"; title: string; description?: string; items: LinkItemDraft[] }
  | { type: "info"; title: string; description?: string; blocks: InfoBlock[] }
  | { type: "gallery"; title: string; description?: string; images: GalleryImage[] }
  | {
      type: "form";
      title: string;
      description?: string;
      fields: FormField[];
      submitLabel?: string;
    }
  | {
      type: "story";
      title: string;
      subtitle?: string;
      heroImage?: { src: string; alt: string };
      blocks: StoryBlock[];
    };

/* ── Serializable link item ───────────────────────────────────────────────── */

export type LinkItemDraft = {
  iconKey: IconKey;
  label: string;
  sublabel?: string;
  action: ActionDraft;
};

/* ── Serializable profile ─────────────────────────────────────────────────── */

export type ProfileDraft = {
  slug: string;
  theme: ThemeName;
  readability: ReadabilityMode;
  monogram?: Badge;
  availability?: Badge;
  name: { first: string; last: string };
  role: string;
  company: string;
  tagline: string;
  location: string;
  timezone: string;
  photo: { src: string; alt: string };
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  featured?: LinkItemDraft;
  contacts: LinkItemDraft[];
  shortcuts: LinkItemDraft[];
  meta?: MetaItem[];
};

/* ── Blank profile template for "create new" ──────────────────────────────── */

export const BLANK_PROFILE: ProfileDraft = {
  slug: "",
  theme: "paper",
  readability: "none",
  name: { first: "", last: "" },
  role: "",
  company: "",
  tagline: "",
  location: "",
  timezone: "",
  photo: { src: "", alt: "" },
  contact: {},
  contacts: [],
  shortcuts: [],
};
