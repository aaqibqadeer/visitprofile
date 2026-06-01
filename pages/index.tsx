import Head from "next/head";
import { profile } from "@/lib/profile";
import { ActionProvider } from "@/components/action/action-provider";
import { ProfileCard } from "@/components/profile/profile-card";

export default function Home() {
  const fullName = `${profile.name.first} ${profile.name.last}`;

  return (
    <>
      <Head>
        <title>{`${fullName} · ${profile.company}`}</title>
        <meta name="description" content={profile.tagline} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      {/*
        Stage: neutral backdrop on wide screens. The card itself takes the full
        viewport on mobile, and a centred, full-height phone-width column on
        larger widths. Same layout everywhere — only the framing changes.
      */}
      <main className="grid h-[100svh] w-full place-items-center bg-stage">
        <div className="relative h-[100svh] w-full overflow-hidden bg-paper sm:h-[min(100svh,880px)] sm:w-[420px] sm:rounded-[2.25rem] sm:shadow-2xl">
          <ActionProvider>
            <ProfileCard profile={profile} />
          </ActionProvider>
        </div>
      </main>
    </>
  );
}
