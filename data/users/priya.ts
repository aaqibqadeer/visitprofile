import { Phone, MapPin, Images, FileText, HelpCircle, Clock } from "lucide-react";
import { A } from "@/lib/actions";
import { WhatsAppIcon } from "@/components/icons";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

const beforeAfter = [
  { src: unsplash(PHOTOS.g4, 800), alt: "Before — worn deck" },
  { src: unsplash(PHOTOS.g5, 800), alt: "After — restored deck" },
  { src: unsplash(PHOTOS.g6, 800), alt: "Before — old fence" },
  { src: unsplash(PHOTOS.g1, 800), alt: "After — new fence" },
];

export const priya: Profile = {
  slug: "user7",
  theme: "paper",
  readability: "plate",

  monogram: "PS",
  availability: "Free estimates",
  name: { first: "Priya", last: "Shah" },
  role: "Handywoman",
  company: "Shah Home Services",
  tagline: "Repairs, decks, and remodels done right.",
  location: "Sacramento, CA",
  timezone: "GMT−8",
  photo: { src: unsplash(PHOTOS.priya), alt: "Priya Shah" },

  contact: { phone: "+1 (916) 555-0124", whatsapp: "+19165550124" },

  featured: {
    icon: HelpCircle,
    label: "Get a free quote",
    sublabel: "Reply within a day",
    action: A.section({
      type: "form",
      title: "Get a free quote",
      description: "Describe the job and I'll send an estimate.",
      submitLabel: "Request quote",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "job", label: "What needs doing?", type: "textarea", required: true },
      ],
    }),
  },

  contacts: [
    { icon: Phone, label: "Call", action: A.tel("+1 (916) 555-0124") },
    { icon: WhatsAppIcon, label: "WhatsApp", action: A.whatsapp("+19165550124") },
    { icon: MapPin, label: "Service area", action: A.maps("Sacramento, CA") },
  ],

  shortcuts: [
    {
      icon: Images,
      label: "Before & after",
      sublabel: "Recent jobs",
      action: A.section({ type: "gallery", title: "Before & after", images: beforeAfter }),
    },
    {
      icon: FileText,
      label: "Price list",
      action: A.section({
        type: "info",
        title: "Typical pricing",
        blocks: [
          { kind: "stat", label: "Hourly", value: "$75" },
          { kind: "stat", label: "Deck repair (avg)", value: "$1,200" },
          { kind: "stat", label: "Fence (per ft)", value: "$45" },
          { kind: "paragraph", text: "Every quote is custom — these are ballparks." },
        ],
      }),
    },
    {
      icon: Clock,
      label: "Request a callback",
      action: A.section({
        type: "form",
        title: "Request a callback",
        submitLabel: "Call me back",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "Booking next week", dot: true },
    { label: "Rated", value: "4.9 ★", serif: true },
    { label: "Reviews", value: "Read", external: true, action: A.external("https://g.page/shah-home") },
  ],
};
