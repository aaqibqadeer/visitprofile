/**
 * Image helpers for placeholder content. All portraits/galleries are Unsplash
 * placeholders — swap `src` values for real assets. The host is allow-listed in
 * `next.config.ts`.
 */
export function unsplash(id: string, w = 1200): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** A few reusable placeholder photo IDs. */
export const PHOTOS = {
  maya: "1531123897727-8f129e1688ce",
  devon: "1500648767791-00dcc994a43e",
  aria: "1438761681033-6461ffad8d80",
  leo: "1507003211169-0a1dd7228f2d",
  sofia: "1544005313-94ddf0286df2",
  noah: "1506794778202-cad84cf45f1d",
  priya: "1573496359142-b8d87734a5a2",
  kai: "1499996860823-5214fcc65f8f",
  // Gallery / content
  g1: "1452587925148-ce544e77e70d",
  g2: "1492691527719-9d1e07e534b4",
  g3: "1465101046530-73398c7f28ca",
  g4: "1487058792275-0ad4aaf24ca7",
  g5: "1519681393784-d120267933ba",
  g6: "1469474968028-56623f02e42e",
} as const;
