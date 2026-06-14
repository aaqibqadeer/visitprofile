import { Calendar, Globe, FileText, Users, HelpCircle, MessageSquare } from "lucide-react";
import { A } from "@/lib/actions";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Phone, Mail, Video } from "lucide-react";
import type { Profile } from "@/data/types";

export const maya: Profile = {
  slug: "user1",
  theme: "paper",
  readability: "scrim",

  monogram: "M·O",
  availability: "Available · Q3",
  name: { first: "Maya", last: "Okafor" },
  role: "Founder & CEO",
  company: "Lumen Studio",
  tagline: "Building quiet software for thoughtful teams.",
  location: "Brooklyn, NY",
  timezone: "GMT−5",
  // Placeholder portrait (updated) — replace with the real asset when available.
  photo: {
    src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Maya Okafor",
  },

  contact: { phone: "+1 (347) 555-0142", email: "maya@lumen.studio" },

  featured: {
    icon: Calendar,
    label: "Book a meeting",
    sublabel: "30 min · next opening Thu 2:00pm",
    action: A.external("https://cal.com/maya-okafor/30min"),
  },

  contacts: [
    { icon: Phone, label: "Call", action: A.tel("+1 (347) 555-0142") },
    { icon: Mail, label: "Email", action: A.mailto("maya@lumen.studio") },
    { icon: Video, label: "FaceTime", action: A.facetime("maya@lumen.studio") },
    { icon: MessageSquare, label: "Message", action: A.sms("+1 (347) 555-0142") },
  ],

  shortcuts: [
    {
      icon: Globe,
      label: "Social",
      sublabel: "Find me everywhere",
      action: A.section({
        type: "social",
        title: "Social",
        items: [
          { network: "x", handle: "@mayaokafor", action: A.external("https://x.com/mayaokafor") },
          {
            network: "linkedin",
            handle: "in/maya-okafor",
            action: A.external("https://linkedin.com/in/maya-okafor"),
          },
          { network: "github", handle: "@mayao", action: A.external("https://github.com/mayao") },
          {
            network: "instagram",
            handle: "@maya.builds",
            action: A.external("https://instagram.com/maya.builds"),
          },
        ],
      }),
    },
    {
      icon: FileText,
      label: "Links",
      sublabel: "Resume, portfolio & more",
      action: A.section({
        type: "links",
        title: "Links",
        items: [
          {
            icon: FileText,
            label: "Resume / CV",
            sublabel: "PDF · 240 KB",
            action: A.download("/maya-cv.pdf", "maya-okafor-cv.pdf"),
          },
          {
            icon: Globe,
            label: "Portfolio",
            sublabel: "lumen.studio",
            action: A.external("https://lumen.studio"),
          },
          {
            icon: LinkedInIcon,
            label: "LinkedIn profile",
            action: A.external("https://linkedin.com/in/maya-okafor"),
          },
          { icon: GitHubIcon, label: "GitHub", action: A.external("https://github.com/mayao") },
          { icon: Video, label: "Zoom room", action: A.external("https://zoom.us/my/mayao") },
        ],
      }),
    },
    {
      icon: Users,
      label: "About",
      sublabel: "Story, team & FAQ",
      action: A.section({
        type: "info",
        title: "About Lumen Studio",
        blocks: [
          {
            kind: "paragraph",
            text: "Lumen builds calm, focused tools for small teams who care about craft.",
          },
          { kind: "heading", text: "What we do" },
          { kind: "list", items: ["Product strategy", "Design systems", "Full-stack engineering"] },
          { kind: "stat", label: "Founded", value: "2019" },
          { kind: "stat", label: "Team", value: "11" },
          { kind: "quote", text: "Working with Maya changed how we ship.", by: "A happy client" },
        ],
      }),
    },
    {
      icon: HelpCircle,
      label: "Inquire",
      sublabel: "Start a project",
      action: A.section({
        type: "form",
        title: "Start a project",
        description: "Tell me a little about what you're building.",
        submitLabel: "Send inquiry",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "What do you need?", type: "textarea", required: true },
        ],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "Shipping v3.2", dot: true },
    { label: "Reading", value: "A Pattern Language", serif: true },
    {
      label: "Notes",
      value: "Latest",
      external: true,
      action: A.external("https://lumen.studio/notes"),
    },
  ],
};
