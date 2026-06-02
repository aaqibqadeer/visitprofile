import type { SocialNetwork } from "@/data/types";
import {
  BehanceIcon,
  DribbbleIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
  type IconType,
} from "@/components/icons";

/** Display metadata for each social network. */
export const socialMeta: Record<SocialNetwork, { label: string; icon: IconType }> = {
  instagram: { label: "Instagram", icon: InstagramIcon },
  facebook: { label: "Facebook", icon: FacebookIcon },
  x: { label: "X", icon: XIcon },
  linkedin: { label: "LinkedIn", icon: LinkedInIcon },
  tiktok: { label: "TikTok", icon: TikTokIcon },
  youtube: { label: "YouTube", icon: YouTubeIcon },
  github: { label: "GitHub", icon: GitHubIcon },
  dribbble: { label: "Dribbble", icon: DribbbleIcon },
  behance: { label: "Behance", icon: BehanceIcon },
  whatsapp: { label: "WhatsApp", icon: WhatsAppIcon },
};
