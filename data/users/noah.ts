import { Mail, Calendar, FileText, BookOpen, Globe, Briefcase } from "lucide-react";
import { A } from "@/lib/actions";
import { GitHubIcon } from "@/components/icons";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

export const noah: Profile = {
  slug: "user6",
  theme: "midnight",
  readability: "shadow",

  monogram: "NB",
  availability: "Available · contract",
  name: { first: "Noah", last: "Bennett" },
  role: "Staff Engineer",
  company: "Freelance",
  tagline: "Distributed systems, dev tools, and clean APIs.",
  location: "Berlin",
  timezone: "GMT+1",
  photo: { src: unsplash(PHOTOS.noah), alt: "Noah Bennett" },

  contact: { email: "noah@bennett.dev" },

  featured: {
    icon: Calendar,
    label: "Book a meeting",
    sublabel: "Cal.com · 30 min",
    action: A.external("https://cal.com/noahbennett"),
  },

  contacts: [
    { icon: Mail, label: "Email", action: A.mailto("noah@bennett.dev") },
    { icon: GitHubIcon, label: "GitHub", action: A.external("https://github.com/noahb") },
    { icon: Globe, label: "Website", action: A.external("https://bennett.dev") },
  ],

  shortcuts: [
    {
      icon: BookOpen,
      label: "Blog",
      sublabel: "Notes on systems",
      action: A.section({
        type: "links",
        title: "Blog",
        description: "Recent posts",
        items: [
          {
            icon: BookOpen,
            label: "Idempotency keys done right",
            sublabel: "8 min read",
            action: A.external("https://bennett.dev/idempotency"),
          },
          {
            icon: BookOpen,
            label: "Queues over cron",
            sublabel: "6 min read",
            action: A.external("https://bennett.dev/queues"),
          },
          {
            icon: BookOpen,
            label: "A case for boring tech",
            sublabel: "5 min read",
            action: A.external("https://bennett.dev/boring"),
          },
        ],
      }),
    },
    {
      icon: FileText,
      label: "Résumé",
      sublabel: "PDF",
      action: A.download("/noah-cv.pdf", "noah-bennett-cv.pdf"),
    },
    {
      icon: Briefcase,
      label: "Services",
      action: A.section({
        type: "info",
        title: "How I help",
        blocks: [
          {
            kind: "list",
            items: ["Architecture reviews", "Backend & infra builds", "Team mentoring"],
          },
          { kind: "stat", label: "Rate", value: "€1,200 / day" },
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
          { network: "github", handle: "@noahb", action: A.external("https://github.com/noahb") },
          { network: "x", handle: "@noah_codes", action: A.external("https://x.com/noah_codes") },
          {
            network: "linkedin",
            handle: "in/noahbennett",
            action: A.external("https://linkedin.com/in/noahbennett"),
          },
        ],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "Open source", dot: true },
    { label: "Stack", value: "Rust · Go", serif: true },
    {
      label: "GitHub",
      value: "@noahb",
      external: true,
      action: A.external("https://github.com/noahb"),
    },
  ],
};
