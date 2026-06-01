import Image from "next/image";
import type { Profile } from "@/lib/profile";
import { Monogram } from "./monogram";
import { StatusBadge } from "./status-badge";

/**
 * The portrait that fills the top of the card. The photo fades into the paper
 * background at the bottom, where the name and details sit overlaid.
 */
export function ProfileHero({ profile }: { profile: Profile }) {
  return (
    <section className="relative min-h-0 flex-1 overflow-hidden">
      <Image
        src={profile.photo.src}
        alt={profile.photo.alt}
        fill
        priority
        unoptimized
        sizes="440px"
        className="object-cover object-top"
      />

      {/* Fade the portrait into the paper background. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-paper via-paper/70 to-transparent" />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
        <Monogram text={profile.monogram} />
        <StatusBadge label={profile.availability} />
      </header>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          {profile.role} · {profile.company}
        </p>
        <h1 className="mt-1 font-serif text-5xl leading-[1.05] text-ink">
          {profile.name.first} <em className="italic">{profile.name.last}</em>
        </h1>
        <p className="mt-3 max-w-[15rem] text-[15px] leading-snug text-ink-soft">
          {profile.tagline}
        </p>
        <p className="mt-2 text-sm text-ink-faint">
          {profile.location} · {profile.timezone}
        </p>
      </div>
    </section>
  );
}
