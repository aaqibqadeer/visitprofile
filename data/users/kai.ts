import { Mail, Music, Globe, Ticket, Mic } from "lucide-react";
import { A } from "@/lib/actions";
import { YouTubeIcon, TikTokIcon } from "@/components/icons";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

export const kai: Profile = {
  slug: "user8",
  theme: "mono",
  readability: "shadow",

  monogram: "KA",
  availability: "New EP out now",
  name: { first: "Kai", last: "Anderson" },
  role: "Musician",
  company: "Independent",
  tagline: "Bedroom pop for late nights and long drives.",
  location: "Los Angeles",
  timezone: "GMT−8",
  photo: { src: unsplash(PHOTOS.kai), alt: "Kai Anderson" },

  contact: { email: "booking@kaimusic.com" },

  featured: {
    icon: Music,
    label: "Listen now",
    sublabel: "Spotify · Apple Music",
    action: A.external("https://open.spotify.com/artist/kai"),
  },

  contacts: [
    { icon: YouTubeIcon, label: "YouTube", action: A.external("https://youtube.com/@kaimusic") },
    { icon: TikTokIcon, label: "TikTok", action: A.external("https://tiktok.com/@kaimusic") },
    { icon: Mail, label: "Booking", action: A.mailto("booking@kaimusic.com", "Booking inquiry") },
  ],

  shortcuts: [
    {
      icon: Globe,
      label: "Social",
      sublabel: "All platforms",
      action: A.section({
        type: "social",
        title: "Follow Kai",
        items: [
          {
            network: "youtube",
            handle: "@kaimusic",
            action: A.external("https://youtube.com/@kaimusic"),
          },
          {
            network: "tiktok",
            handle: "@kaimusic",
            action: A.external("https://tiktok.com/@kaimusic"),
          },
          { network: "instagram", handle: "@kai", action: A.external("https://instagram.com/kai") },
          { network: "x", handle: "@kaimusic", action: A.external("https://x.com/kaimusic") },
        ],
      }),
    },
    {
      icon: Ticket,
      label: "Tour dates",
      action: A.section({
        type: "info",
        title: "Upcoming shows",
        blocks: [
          { kind: "stat", label: "Jun 18 · LA", value: "The Echo" },
          { kind: "stat", label: "Jun 24 · SF", value: "Rickshaw Stop" },
          { kind: "stat", label: "Jul 02 · Portland", value: "Doug Fir" },
        ],
      }),
    },
    {
      icon: Mic,
      label: "Join the waitlist",
      sublabel: "Early access to drops",
      action: A.section({
        type: "form",
        title: "Join the waitlist",
        description: "Be first to hear new releases.",
        submitLabel: "Join waitlist",
        fields: [{ name: "email", label: "Email", type: "email", required: true }],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "New EP: Halo", dot: true },
    { label: "Mood", value: "Nocturne", serif: true },
    {
      label: "Merch",
      value: "Shop",
      external: true,
      action: A.external("https://shop.kaimusic.com"),
    },
  ],
};
