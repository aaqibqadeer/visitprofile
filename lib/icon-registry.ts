import {
  Phone,
  Mail,
  MessageSquare,
  Globe,
  FileText,
  Star,
  Briefcase,
  Users,
  HelpCircle,
  Calendar,
  Video,
  Download,
  BookOpen,
  Music,
  Mic,
  Ticket,
  Map,
  MapPin,
  Image,
  Images,
  Camera,
  ShoppingBag,
  Utensils,
  Clock,
  CreditCard,
} from "lucide-react";
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
  TikTokIcon,
  WhatsAppIcon,
  GitHubIcon,
  DribbbleIcon,
  BehanceIcon,
  type IconType,
} from "@/components/icons";
import type { IconKey, ProfileDraft, LinkItemDraft, ActionDraft, SectionDraft } from "@/data/draft-types";
import type { Profile, LinkItem, Section } from "@/data/types";
import type { Action } from "@/lib/actions";

export const ICON_REGISTRY: Record<IconKey, IconType> = {
  Phone,
  Mail,
  MessageSquare,
  Globe,
  FileText,
  Star,
  Briefcase,
  Users,
  HelpCircle,
  Calendar,
  Video,
  Download,
  BookOpen,
  Music,
  Mic,
  Ticket,
  Map,
  MapPin,
  Image,
  Images,
  Camera,
  ShoppingBag,
  Utensils,
  Clock,
  CreditCard,
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
  TikTokIcon,
  WhatsAppIcon,
  GitHubIcon,
  DribbbleIcon,
  BehanceIcon,
};

export const resolveIcon = (key: IconKey): IconType => ICON_REGISTRY[key];

function resolveAction(action: ActionDraft): Action {
  if (action.kind === "section") {
    return { kind: "section", section: resolveSection(action.section) };
  }
  return action as Action;
}

function resolveSection(section: SectionDraft): Section {
  if (section.type === "links") {
    return {
      ...section,
      items: section.items.map(resolveLink),
    };
  }
  return section as unknown as Section;
}

function resolveLink(draft: LinkItemDraft): LinkItem {
  return {
    icon: resolveIcon(draft.iconKey),
    label: draft.label,
    sublabel: draft.sublabel,
    action: resolveAction(draft.action),
  };
}

export function resolveProfile(draft: ProfileDraft): Profile {
  return {
    slug: draft.slug,
    theme: draft.theme,
    readability: draft.readability,
    monogram: draft.monogram,
    availability: draft.availability,
    name: draft.name,
    role: draft.role,
    company: draft.company,
    tagline: draft.tagline,
    location: draft.location,
    timezone: draft.timezone,
    photo: draft.photo,
    contact: draft.contact,
    featured: draft.featured ? resolveLink(draft.featured) : undefined,
    contacts: draft.contacts.map(resolveLink),
    shortcuts: draft.shortcuts.map(resolveLink),
    meta: draft.meta,
  };
}
