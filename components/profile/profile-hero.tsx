import Image from "next/image";
import type { Profile } from "@/data/types";
import { readabilityClass } from "@/data/themes";
import { cn } from "@/lib/utils";
import { Monogram } from "./monogram";
import { StatusBadge } from "./status-badge";

/**
 * The portrait that fills the top of the card. It fades into the paper panel at
 * the bottom, where the name and details sit overlaid. The `readability` mode
 * (from the profile) keeps the text legible when it clashes with the photo.
 */
export function ProfileHero({ profile }: { profile: Profile }) {
  const r = readabilityClass(profile.readability);

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
        {profile.availability && <StatusBadge label={profile.availability} />}
      </header>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 px-6 pb-2">
        <p className={cn("text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase", r)}>
          {profile.role} · {profile.company}
        </p>
        <h1 className={cn("font-serif text-5xl leading-[1.05] text-ink", r)}>
          {profile.name.first} <em className="italic">{profile.name.last}</em>
        </h1>
        <p className={cn("mt-2 max-w-[15rem] text-[15px] leading-snug text-ink-soft", r)}>
          {profile.tagline}
        </p>
        <p className={cn("mt-1 text-sm text-ink-faint", r)}>
          {profile.location} · {profile.timezone}
        </p>
      </div>
    </section>
  );
}
