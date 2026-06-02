import { Download, QrCode, Share2 } from "lucide-react";
import type { Profile } from "@/data/types";
import { A } from "@/lib/actions";
import { ProfileHero } from "./profile-hero";
import { FeaturedCard } from "./featured-card";
import { ActionGrid } from "./action-tile";
import { LinkRow } from "./link-row";
import { MetaRow } from "./meta-row";
import { FooterActions } from "./footer-actions";

/**
 * Top-level composition for the profile screen. Lays the pieces out in a single
 * non-scrolling column. The long catalogues (social, links, info, galleries,
 * forms) live behind `shortcuts`, which open sheets — keeping the home screen
 * itself fixed-height.
 */
export function ProfileCard({ profile }: { profile: Profile }) {
  const profileUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://visitprofile.app/${profile.slug}`;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-paper">
      <ProfileHero profile={profile} />

      <div className="shrink-0 space-y-3 px-5 pb-5 pt-1">
        {profile.featured && <FeaturedCard item={profile.featured} />}

        <ActionGrid items={profile.contacts} />

        {profile.shortcuts.length > 0 && (
          <div className="space-y-2">
            {profile.shortcuts.map((item) => (
              <LinkRow key={item.label} item={item} />
            ))}
          </div>
        )}

        <MetaRow items={profile.meta} />

        <FooterActions
          actions={[
            {
              icon: Share2,
              label: "Share",
              action: A.share({
                title: `${profile.name.first} ${profile.name.last}`,
                url: profileUrl,
              }),
            },
            {
              icon: QrCode,
              label: "QR",
              action: A.sheet({
                title: "Scan to connect",
                description: "Point a camera at this code to open the profile.",
                body: <QrPlaceholder url={profileUrl} />,
              }),
            },
            { icon: Download, label: "Save vCard", action: A.vcard() },
          ]}
        />
      </div>
    </div>
  );
}

/** Lightweight decorative stand-in for a real QR code. */
function QrPlaceholder({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid size-44 grid-cols-7 gap-1 rounded-2xl bg-white p-4">
        {Array.from({ length: 49 }).map((_, i) => (
          <span
            key={i}
            className={
              (i * 7 + ((i * 13) % 5)) % 3 === 0
                ? "rounded-[2px] bg-ink"
                : "rounded-[2px] bg-transparent"
            }
          />
        ))}
      </div>
      <span className="max-w-full truncate text-xs text-ink-faint">{url}</span>
    </div>
  );
}
