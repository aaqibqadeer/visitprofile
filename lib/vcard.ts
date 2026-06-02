import type { Profile } from "@/data/types";

/** Build a minimal vCard 3.0 string from a profile. */
export function buildVCard(p: Profile): string {
  const full = `${p.name.first} ${p.name.last}`;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${p.name.last};${p.name.first};;;`,
    `FN:${full}`,
    `TITLE:${p.role}`,
    `ORG:${p.company}`,
  ];
  if (p.contact.phone) lines.push(`TEL;TYPE=CELL:${p.contact.phone}`);
  if (p.contact.email) lines.push(`EMAIL;TYPE=WORK:${p.contact.email}`);
  lines.push(`ADR;TYPE=WORK:;;${p.location};;;;`, "END:VCARD");
  return lines.join("\r\n");
}

/** Trigger a client-side download of the contact as a .vcf file. */
export function downloadVCard(p: Profile): void {
  triggerDownload(
    new Blob([buildVCard(p)], { type: "text/vcard" }),
    `${p.name.first}-${p.name.last}.vcf`.toLowerCase()
  );
}

/** Download an arbitrary URL as a file (used by `download` actions). */
export function downloadUrl(href: string, filename?: string): void {
  const a = document.createElement("a");
  a.href = href;
  if (filename) a.download = filename;
  a.target = "_blank";
  a.rel = "noopener";
  a.click();
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
