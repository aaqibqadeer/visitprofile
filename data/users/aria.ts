import { Phone, Mail, MessageSquare, Globe, FileText, Star, Briefcase } from "lucide-react";
import { A } from "@/lib/actions";
import { DribbbleIcon, BehanceIcon, LinkedInIcon } from "@/components/icons";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

export const aria: Profile = {
  slug: "user3",
  theme: "violet",
  readability: "shadow",

  monogram: "AN",
  availability: "Open to freelance",
  name: { first: "Aria", last: "Nakamura" },
  role: "Product Designer",
  company: "Independent",
  tagline: "Interfaces that feel obvious in hindsight.",
  location: "Austin, TX",
  timezone: "GMT−6",
  photo: { src: unsplash(PHOTOS.aria), alt: "Aria Nakamura" },

  contact: { phone: "+1 (512) 555-0188", email: "hi@arian.design" },

  featured: {
    icon: FileText,
    label: "Download résumé",
    sublabel: "PDF · 1 page",
    action: A.download("/aria-resume.pdf", "aria-nakamura-resume.pdf"),
  },

  contacts: [
    { icon: Phone, label: "Call", action: A.tel("+1 (512) 555-0188") },
    { icon: Mail, label: "Email", action: A.mailto("hi@arian.design") },
    { icon: MessageSquare, label: "Text", action: A.sms("+1 (512) 555-0188") },
  ],

  shortcuts: [
    {
      icon: Briefcase,
      label: "Work & links",
      action: A.section({
        type: "links",
        title: "Work",
        items: [
          { icon: DribbbleIcon, label: "Dribbble", sublabel: "Shots & explorations", action: A.external("https://dribbble.com/arian") },
          { icon: BehanceIcon, label: "Behance", sublabel: "Case studies", action: A.external("https://behance.net/arian") },
          { icon: Globe, label: "Portfolio", action: A.external("https://arian.design") },
          { icon: LinkedInIcon, label: "LinkedIn", action: A.external("https://linkedin.com/in/arian") },
        ],
      }),
    },
    {
      icon: Star,
      label: "Testimonials",
      action: A.section({
        type: "info",
        title: "Testimonials",
        blocks: [
          { kind: "quote", text: "Aria shipped our redesign in six weeks. Conversions are up 30%.", by: "PM, Fintech startup" },
          { kind: "quote", text: "The most thoughtful designer I've worked with.", by: "Engineering lead" },
          { kind: "quote", text: "Clear, fast, and a joy to collaborate with.", by: "Founder" },
        ],
      }),
    },
    {
      icon: Globe,
      label: "Social",
      action: A.section({
        type: "social",
        title: "Social",
        items: [
          { network: "dribbble", handle: "@arian", action: A.external("https://dribbble.com/arian") },
          { network: "behance", handle: "arian", action: A.external("https://behance.net/arian") },
          { network: "x", handle: "@arian_design", action: A.external("https://x.com/arian_design") },
        ],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "Design systems", dot: true },
    { label: "Tool", value: "Figma", serif: true },
    { label: "Dribbble", value: "View", external: true, action: A.external("https://dribbble.com/arian") },
  ],
};
