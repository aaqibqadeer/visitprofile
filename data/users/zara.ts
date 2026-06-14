import { Globe, Phone, Mail, Users } from "lucide-react";
import { A } from "@/lib/actions";
import { WhatsAppIcon, InstagramIcon, LinkedInIcon, XIcon } from "@/components/icons";
import type { Profile } from "@/data/types";
import { unsplash, PHOTOS } from "./_assets";

/**
 * Zara Mirza — user9
 * Theme: Ajrak (deep crimson, ivory, near-black — inspired by Sindhi block-printing)
 * Layout: 1 featured "About Me" card  +  3 tiles (Contact · Social · Visit)
 */
export const zara: Profile = {
  slug: "user9",
  theme: "ajrak",
  readability: "shadow",
  ornament: "ajrak",

  eventBadge: "Sindh Cultural Day",
  name: { first: "Zara", last: "Mirza" },
  role: "Textile Artist & Storyteller",
  company: "Studio Zara",
  tagline: "ياداشت جا نقش · مٽيءَ جو فن",
  location: "Karachi · London",
  timezone: "GMT+5 / GMT+1",
  photo: {
    // Warm-toned portrait placeholder — swap for real photo
    src: unsplash(PHOTOS.aria),
    alt: "Zara Mirza",
  },

  contact: {
    phone: "+92 300 555 0177",
    email: "zara@studiozara.com",
    whatsapp: "+923005550177",
  },

  /* ── Featured: opens the storytelling "About Me" sheet ─────────────────── */
  featured: {
    icon: Users,
    label: "About me",
    sublabel: "My story · craft · journey",
    action: A.section({
      type: "story",
      title: "I am Zara Mirza",
      subtitle: "Textile artist. Storyteller. Keeper of patterns.",
      heroImage: {
        src: unsplash(PHOTOS.g2),
        alt: "Intricate ajrak patterns spread across a studio table",
      },
      blocks: [
        {
          kind: "paragraph",
          text: "I grew up in Karachi, where the streets smell of jasmine in the evening and the bazaars overflow with colour. My grandmother's hands were always stained with indigo. She never called what she did 'art' — she called it remembering.",
        },
        {
          kind: "image",
          src: unsplash(PHOTOS.g4),
          alt: "Hands pressing a carved wooden block into crimson-dyed fabric",
          caption: "Block-printing in the family workshop, Hyderabad, 2019",
        },
        {
          kind: "heading",
          text: "The craft",
        },
        {
          kind: "paragraph",
          text: "Ajrak is a centuries-old resist-printing technique from Sindh — a dialogue between the maker and the material. Each cloth passes through seventeen stages of dyeing, drying, and washing before it is ready. You cannot rush it. The land and the light decide the colour.",
        },
        {
          kind: "quote",
          text: "A pattern is not decoration. It is a map of belonging.",
          by: "Zara Mirza",
        },
        {
          kind: "divider",
        },
        {
          kind: "subheading",
          text: "London chapter",
        },
        {
          kind: "paragraph",
          text: "I moved to London in 2018 to study at the Royal College of Art. I arrived with two suitcases and a roll of cloth. The city was grey and cold and completely indifferent to jasmine. I fell in love with it immediately.",
        },
        {
          kind: "paragraph",
          text: "My practice now lives between two cities. The dye vats are in Karachi; the loom is in Hackney. The work is about that distance — the thread that stretches across water and does not break.",
        },
        {
          kind: "image",
          src: unsplash(PHOTOS.g6),
          alt: "A finished ajrak cloth pinned to a white studio wall",
          caption: "Studio Zara, Hackney, 2024",
        },
        {
          kind: "heading",
          text: "Commissions & collaborations",
        },
        {
          kind: "paragraph",
          text: "I work with individuals, fashion houses, and cultural institutions. Each commission begins with a conversation — about memory, place, and what you want the cloth to carry. Pieces take six to fourteen weeks.",
        },
        {
          kind: "divider",
        },
        {
          kind: "paragraph",
          text: "If any of this resonates, write to me. I read every message. Sometimes slowly, but always eventually.",
        },
      ],
    }),
  },

  /* ── 3 contact tiles ─────────────────────────────────────────────────── */
  contacts: [
    {
      icon: Phone,
      label: "Contact",
      action: A.section({
        type: "links",
        title: "Contact",
        description: "Reach Zara directly",
        items: [
          {
            icon: Mail,
            label: "Email",
            sublabel: "zara@studiozara.com",
            action: A.mailto("zara@studiozara.com"),
          },
          {
            icon: WhatsAppIcon,
            label: "WhatsApp",
            sublabel: "+92 300 555 0177",
            action: A.whatsapp(
              "+923005550177",
              "Hi Zara, I came across your work and would love to connect."
            ),
          },
          {
            icon: Phone,
            label: "Call",
            sublabel: "+92 300 555 0177",
            action: A.tel("+92 300 555 0177"),
          },
        ],
      }),
    },
    {
      icon: InstagramIcon,
      label: "Social",
      action: A.section({
        type: "social",
        title: "Follow the work",
        description: "Studio updates, process videos, and the occasional poem",
        items: [
          {
            network: "instagram",
            handle: "@studiozara",
            action: A.external("https://instagram.com/studiozara"),
          },
          {
            network: "x",
            handle: "@zara_mirza",
            action: A.external("https://x.com/zara_mirza"),
          },
          {
            network: "linkedin",
            handle: "in/zara-mirza",
            action: A.external("https://linkedin.com/in/zara-mirza"),
          },
        ],
      }),
    },
    {
      icon: Globe,
      label: "Visit",
      action: A.external("https://studiozara.com"),
    },
  ],

  /* ── No shortcut rows — layout is fully contained in the 4 buttons above ─ */
  shortcuts: [],
};
