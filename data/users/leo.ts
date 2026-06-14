import { Phone, MapPin, Clock, FileText, ShoppingBag, Utensils, Globe } from "lucide-react";
import { A } from "@/lib/actions";
import { WhatsAppIcon } from "@/components/icons";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

export const leo: Profile = {
  slug: "user4",
  theme: "sunset",
  readability: "plate",

  monogram: "LM",
  availability: "Open today",
  name: { first: "Leo", last: "Martins" },
  role: "Chef & Owner",
  company: "Casa Martins",
  tagline: "Wood-fired plates, natural wine, good company.",
  location: "Lisbon",
  timezone: "GMT+0",
  photo: { src: unsplash(PHOTOS.leo), alt: "Leo Martins" },

  contact: { phone: "+351 21 555 0190", whatsapp: "+351215550190" },

  featured: {
    icon: ShoppingBag,
    label: "Order now",
    sublabel: "Delivery & pickup",
    action: A.external("https://order.casamartins.pt"),
  },

  contacts: [
    { icon: Phone, label: "Call", action: A.tel("+351 21 555 0190") },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      action: A.whatsapp("+351215550190", "Hi! I'd like to book a table."),
    },
    { icon: MapPin, label: "Directions", action: A.maps("Casa Martins, Lisbon") },
  ],

  shortcuts: [
    {
      icon: Utensils,
      label: "Menu",
      sublabel: "Dinner · PDF",
      action: A.download("/casa-martins-menu.pdf", "casa-martins-menu.pdf"),
    },
    {
      icon: FileText,
      label: "Price list",
      action: A.section({
        type: "info",
        title: "Price list",
        blocks: [
          { kind: "stat", label: "Wood-fired flatbread", value: "€9" },
          { kind: "stat", label: "Grilled octopus", value: "€18" },
          { kind: "stat", label: "Chef's tasting", value: "€55" },
          { kind: "stat", label: "Natural wine (glass)", value: "€7" },
        ],
      }),
    },
    {
      icon: Clock,
      label: "Business hours",
      action: A.section({
        type: "info",
        title: "Hours",
        blocks: [
          { kind: "stat", label: "Tue – Thu", value: "18:00 – 23:00" },
          { kind: "stat", label: "Fri – Sat", value: "18:00 – 01:00" },
          { kind: "stat", label: "Sun", value: "13:00 – 22:00" },
          { kind: "stat", label: "Mon", value: "Closed" },
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
          {
            network: "instagram",
            handle: "@casamartins",
            action: A.external("https://instagram.com/casamartins"),
          },
          {
            network: "facebook",
            handle: "Casa Martins",
            action: A.external("https://facebook.com/casamartins"),
          },
          {
            network: "tiktok",
            handle: "@casamartins",
            action: A.external("https://tiktok.com/@casamartins"),
          },
        ],
      }),
    },
  ],

  meta: [
    { label: "Tonight", value: "Few tables left", dot: true },
    { label: "Special", value: "Octopus", serif: true },
    {
      label: "Reserve",
      value: "Book",
      external: true,
      action: A.external("https://book.casamartins.pt"),
    },
  ],
};
