import { Phone, Mail, Image as ImageIcon, Globe, CreditCard, Camera, MapPin } from "lucide-react";
import { A } from "@/lib/actions";
import type { Profile } from "@/data/types";
import { PHOTOS, unsplash } from "./_assets";

const gallery = [
  { src: unsplash(PHOTOS.g1, 800), alt: "Landscape at dusk" },
  { src: unsplash(PHOTOS.g2, 800), alt: "Forest path" },
  { src: unsplash(PHOTOS.g3, 800), alt: "Mountain range" },
  { src: unsplash(PHOTOS.g4, 800), alt: "Foggy hills" },
  { src: unsplash(PHOTOS.g5, 800), alt: "Starry sky" },
  { src: unsplash(PHOTOS.g6, 800), alt: "Deer in field" },
];

export const devon: Profile = {
  slug: "user2",
  theme: "mono",
  readability: "plate",

  monogram: "DC",
  availability: "Booking 2026",
  name: { first: "Devon", last: "Carter" },
  role: "Photographer",
  company: "Carter Visuals",
  tagline: "Light, landscapes, and the occasional portrait.",
  location: "Portland, OR",
  timezone: "GMT−8",
  photo: { src: unsplash(PHOTOS.devon), alt: "Devon Carter" },

  contact: { phone: "+1 (503) 555-0117", email: "devon@cartervisuals.com" },

  featured: {
    icon: ImageIcon,
    label: "Photo gallery",
    sublabel: "Recent work",
    action: A.section({ type: "gallery", title: "Recent work", images: gallery }),
  },

  contacts: [
    { icon: Phone, label: "Call", action: A.tel("+1 (503) 555-0117") },
    { icon: Mail, label: "Email", action: A.mailto("devon@cartervisuals.com") },
    { icon: MapPin, label: "Studio", action: A.maps("Carter Visuals, Portland OR") },
  ],

  shortcuts: [
    {
      icon: Globe,
      label: "Social",
      action: A.section({
        type: "social",
        title: "Social",
        items: [
          {
            network: "instagram",
            handle: "@carter.visuals",
            action: A.external("https://instagram.com/carter.visuals"),
          },
          {
            network: "behance",
            handle: "carter",
            action: A.external("https://behance.net/carter"),
          },
          {
            network: "youtube",
            handle: "@cartervisuals",
            action: A.external("https://youtube.com/@cartervisuals"),
          },
        ],
      }),
    },
    {
      icon: Camera,
      label: "Portfolio showcase",
      sublabel: "Full image grid",
      action: A.section({ type: "gallery", title: "Portfolio", images: [...gallery, ...gallery] }),
    },
    {
      icon: CreditCard,
      label: "Pay me",
      sublabel: "Deposits & invoices",
      action: A.section({
        type: "links",
        title: "Pay me",
        items: [
          {
            icon: CreditCard,
            label: "PayPal",
            action: A.external("https://paypal.me/cartervisuals"),
          },
          {
            icon: CreditCard,
            label: "Venmo",
            action: A.external("https://venmo.com/cartervisuals"),
          },
          {
            icon: CreditCard,
            label: "Stripe invoice",
            action: A.external("https://buy.stripe.com/test_devon"),
          },
        ],
      }),
    },
  ],

  meta: [
    { label: "Now", value: "On assignment", dot: true },
    { label: "Gear", value: "Leica Q3", serif: true },
    {
      label: "Prints",
      value: "Shop",
      external: true,
      action: A.external("https://cartervisuals.com/shop"),
    },
  ],
};
