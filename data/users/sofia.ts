import { Phone, Mail, Calendar, Download, Star, HelpCircle, Briefcase } from "lucide-react";
import { A } from "@/lib/actions";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

export const sofia: Profile = {
  slug: "user5",
  theme: "forest",
  readability: "none",

  monogram: "SR",
  availability: "Taking clients",
  name: { first: "Sofia", last: "Reyes" },
  role: "Leadership Coach",
  company: "Reyes Coaching",
  tagline: "Helping founders lead without burning out.",
  location: "Remote",
  timezone: "GMT−5",
  photo: { src: unsplash(PHOTOS.sofia), alt: "Sofia Reyes" },

  contact: { phone: "+1 (646) 555-0173", email: "sofia@reyes.coach" },

  featured: {
    icon: Calendar,
    label: "Book a free consult",
    sublabel: "20 min · no strings",
    action: A.external("https://calendly.com/reyescoaching/intro"),
  },

  contacts: [
    { icon: Phone, label: "Call", action: A.tel("+1 (646) 555-0173") },
    { icon: Mail, label: "Email", action: A.mailto("sofia@reyes.coach") },
  ],

  shortcuts: [
    {
      icon: Download,
      label: "Free guide",
      sublabel: "“The Calm Founder” · PDF",
      action: A.download("/calm-founder.pdf", "the-calm-founder.pdf"),
    },
    {
      icon: Briefcase,
      label: "Services",
      action: A.section({
        type: "info",
        title: "Services",
        blocks: [
          { kind: "heading", text: "1:1 Coaching" },
          { kind: "paragraph", text: "Biweekly sessions over 3–6 months." },
          { kind: "heading", text: "Team workshops" },
          { kind: "list", items: ["Leadership offsites", "Feedback culture", "Founder–team alignment"] },
        ],
      }),
    },
    {
      icon: Star,
      label: "Testimonials",
      action: A.section({
        type: "info",
        title: "What clients say",
        blocks: [
          { kind: "quote", text: "Sofia helped me delegate for the first time in years.", by: "Seed-stage founder" },
          { kind: "quote", text: "Our leadership team finally talks straight.", by: "Series A CEO" },
        ],
      }),
    },
    {
      icon: HelpCircle,
      label: "Request a callback",
      action: A.section({
        type: "form",
        title: "Request a callback",
        description: "Leave your number and I'll call within a day.",
        submitLabel: "Request callback",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "2 spots open", dot: true },
    { label: "Reading", value: "The Mountain Is You", serif: true },
    { label: "Waitlist", value: "Join", external: true, action: A.section({ type: "form", title: "Join the waitlist", submitLabel: "Join waitlist", fields: [{ name: "email", label: "Email", type: "email", required: true }] }) },
  ],
};
