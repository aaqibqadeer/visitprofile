import Head from "next/head";
import { useState } from "react";
import { LogOut, Key } from "lucide-react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import type { ProfileDraft } from "@/data/draft-types";
import { withAuth } from "@/lib/with-auth";
import { getProfileByUserId } from "@/lib/supabase/profile-helpers";
import { EditorLayout } from "@/components/admin/editor-layout";
import { createClient } from "@/lib/supabase/client";

interface Props {
  user: { id: string; email: string; role: "user" | "admin" };
  profile: ProfileDraft | null;
}

export default function DashboardPage({ user, profile }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProfileDraft | null>(profile);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSave = async (updated: ProfileDraft) => {
    await fetch(`/api/profiles/${updated.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setDraft(updated);
  };

  if (!draft) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 text-center">
        <Head><title>Dashboard · VisitProfile</title></Head>
        <h1 className="mb-2 text-xl font-bold text-zinc-900">No profile yet</h1>
        <p className="text-sm text-zinc-500">Your profile is being set up. Check back soon.</p>
        <button onClick={handleLogout} className="mt-6 text-sm text-zinc-400 hover:text-zinc-700">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <Head><title>My Profile · VisitProfile</title></Head>
      <div className="flex h-screen flex-col">
        {/* Nav bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-950 px-4">
          <p className="text-sm font-semibold text-white">My Profile</p>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/analytics"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Analytics
            </a>
            <a
              href="/dashboard/billing"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Billing
            </a>
            <a
              href="/dashboard/change-password"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            >
              <Key className="size-3.5" /> Change password
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <EditorLayout
            initial={draft}
            onSave={handleSave}
            onBack={() => {}}
          />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth("user", async (_ctx, user) => {
  const profile = await getProfileByUserId(user.id);
  return { props: { profile } };
});
