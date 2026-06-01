import { Download, Mail, MessageSquare, Phone, QrCode, Share2 } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import type { Profile } from "@/lib/profile";
import type { Action } from "@/lib/actions";
import { ProfileHero } from "./profile-hero";
import { BookingCard } from "./booking-card";
import { ActionGrid } from "./action-tile";
import { MetaRow } from "./meta-row";
import { FooterActions } from "./footer-actions";

/**
 * Top-level composition for the profile screen. Maps profile data onto the
 * action layer and lays the pieces out in a single non-scrolling column.
 */
export function ProfileCard({ profile }: { profile: Profile }) {
  const profileUrl =
    typeof window !== "undefined" ? window.location.href : "https://lumen.studio/maya";

  const qrAction: Action = {
    kind: "sheet",
    content: {
      title: "Scan to connect",
      description: "Point a camera at this code to open the profile.",
      body: <QrPlaceholder url={profileUrl} />,
    },
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-paper">
      <ProfileHero profile={profile} />

      <div className="shrink-0 space-y-3 px-5 pb-5 pt-1">
        <BookingCard
          title={profile.booking.title}
          detail={profile.booking.detail}
          action={{ kind: "external", href: profile.booking.href }}
        />

        <ActionGrid
          tiles={[
            { icon: Phone, label: "Call", action: { kind: "tel", value: profile.phone } },
            { icon: Mail, label: "Email", action: { kind: "mailto", value: profile.email } },
            { icon: MessageSquare, label: "Message", action: { kind: "sms", value: profile.phone } },
            { icon: LinkedInIcon, label: "LinkedIn", action: { kind: "external", href: profile.links.linkedin } },
          ]}
        />

        <MetaRow items={profile.meta} />

        <div className="pt-1">
          <FooterActions
            actions={[
              {
                icon: Share2,
                label: "Share",
                action: {
                  kind: "share",
                  data: { title: `${profile.name.first} ${profile.name.last}`, url: profileUrl },
                },
              },
              { icon: QrCode, label: "QR", action: qrAction },
              { icon: Download, label: "Save vCard", action: { kind: "vcard" } },
            ]}
          />
        </div>
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
              (i * 7 + ((i * 13) % 5)) % 3 === 0 ? "rounded-[2px] bg-ink" : "rounded-[2px] bg-transparent"
            }
          />
        ))}
      </div>
      <span className="max-w-full truncate text-xs text-ink-faint">{url}</span>
    </div>
  );
}
