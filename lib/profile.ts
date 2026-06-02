/**
 * Single source of truth for everything shown on the profile card.
 *
 * Swap these values (or fetch them from an API and pass them through the same
 * shape) to render a different person. Nothing in the UI hard-codes copy —
 * components read from this object so the screen stays data-driven.
 */
export type ProfileMetaItem = {
  label: string;
  value: string;
  /** Optional accent dot before the value (e.g. a live status). */
  dot?: boolean;
  /** Italic serif treatment, used for the "reading" entry. */
  serif?: boolean;
  /** Trailing ↗ affordance hinting the value opens something. */
  external?: boolean;
};

export type Profile = {
  monogram: string;
  availability: string;
  name: { first: string; last: string };
  role: string;
  company: string;
  tagline: string;
  location: string;
  timezone: string;
  /** Portrait shown as the hero. Any person photo works as a placeholder. */
  photo: { src: string; alt: string };
  phone: string;
  email: string;
  links: { linkedin: string };
  booking: {
    title: string;
    detail: string;
    href: string;
  };
  meta: ProfileMetaItem[];
};

export const profile: Profile =
  {
    monogram:
      'M·O',
    availability:
      'Available · Q3',
    name: {
      first:
        'Maya',
      last: 'Okafor'
    },
    role: 'Founder & CEO',
    company:
      'Lumen Studio',
    tagline:
      'Building quiet software for thoughtful teams.',
    location:
      'Brooklyn, NY',
    timezone:
      'GMT−5',
    photo:
      {
        // Placeholder portrait — replace with the real asset when available.
        src: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Maya Okafor'
      },
    phone:
      '+1 (347) 555-0142',
    email:
      'maya@lumen.studio',
    links:
      {
        linkedin:
          'https://www.linkedin.com/in/maya-okafor'
      },
    booking:
      {
        title:
          'Book a meeting',
        detail:
          '30 min · next opening Thu 2:00pm',
        href: 'https://cal.com/maya-okafor/30min'
      },
    meta: [
      {
        label:
          'Now',
        value:
          'Shipping v3.2',
        dot: true
      },
      {
        label:
          'Reading',
        value:
          'A Pattern Language',
        serif: true
      },
      {
        label:
          'Notes',
        value:
          'Latest',
        external: true
      }
    ]
  }
