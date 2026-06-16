import Head from "next/head";
import { useEffect } from "react";
import type { Profile } from "@/data/types";
import { themeStyle } from "@/data/themes";
import { ActionProvider } from "@/components/action/action-provider";
import { ProfileCard } from "./profile-card";
import { trackView } from "@/lib/analytics";

/**
 * Full-screen frame for a profile. Mobile: the card fills the viewport. Wider
 * screens: a centred, **full-height** column (no rounded "phone" edges — the
 * edges are flush, just like the mobile screen). The active theme's CSS vars
 * are applied here so both the card and its sheets inherit them.
 */
export function ProfileScreen({ profile, preview }: { profile: Profile; preview?: boolean }) {
  const fullName = `${profile.name.first} ${profile.name.last}`;

  useEffect(() => {
    if (!preview) trackView(profile.slug);
  }, [profile.slug, preview]);

  return (
    <>
      {!preview && (
        <Head>
          <title>{`${fullName} · ${profile.company}`}</title>
          <meta name="description" content={profile.tagline} />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        </Head>
      )}

      <main
        className="grid h-[100svh] w-full place-items-center bg-stage"
        style={themeStyle(profile.theme)}
      >
        <div
          className="relative h-[100svh] w-full overflow-hidden bg-paper sm:w-[440px]"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <ActionProvider profile={profile}>
            <ProfileCard profile={profile} />
          </ActionProvider>
        </div>
      </main>
    </>
  );
}
