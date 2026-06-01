import type { Profile } from "./profile";

/** Build a minimal vCard 3.0 string from a profile. */
export function buildVCard(p: Profile): string {
  const full = `${p.name.first} ${p.name.last}`;
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${p.name.last};${p.name.first};;;`,
    `FN:${full}`,
    `TITLE:${p.role}`,
    `ORG:${p.company}`,
    `TEL;TYPE=CELL:${p.phone}`,
    `EMAIL;TYPE=WORK:${p.email}`,
    `URL:${p.links.linkedin}`,
    `ADR;TYPE=WORK:;;${p.location};;;;`,
    "END:VCARD",
  ].join("\r\n");
}

/** Trigger a client-side download of the contact as a .vcf file. */
export function downloadVCard(p: Profile): void {
  const blob = new Blob([buildVCard(p)], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.name.first}-${p.name.last}.vcf`.toLowerCase();
  a.click();
  URL.revokeObjectURL(url);
}
