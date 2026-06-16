import Head from "next/head";
import { useState, useEffect } from "react";
import { Download, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ProfileDraft } from "@/data/draft-types";
import { BLANK_PROFILE } from "@/data/draft-types";
import { ProfileGrid } from "@/components/admin/profile-grid";
import { EditorLayout } from "@/components/admin/editor-layout";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileDraft[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<ProfileDraft | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/profiles");
    if (res.status === 403) {
      router.push("/login");
      return;
    }
    if (res.ok) setProfiles(await res.json() as ProfileDraft[]);
    setLoaded(true);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (draft: ProfileDraft) => {
    await fetch(`/api/admin/profiles/${draft.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setEditing(draft);
    load();
  };

  const handleDelete = async (slug: string) => {
    await fetch(`/api/admin/profiles/${slug}/archive`, { method: "POST" });
    load();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "profiles.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-100">
        <p className="text-sm text-zinc-400">Loading…</p>
      </div>
    );
  }

  if (editing) {
    return (
      <EditorLayout
        initial={editing}
        onSave={handleSave}
        onBack={() => setEditing(null)}
      />
    );
  }

  const handleCreate = () => {
    const blank: ProfileDraft = { ...BLANK_PROFILE, slug: `user${profiles.length + 1}` };
    setEditing(blank);
  };

  return (
    <>
      <Head><title>Admin · VisitProfile</title></Head>
      <div className="min-h-screen bg-zinc-100">
        <div className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-lg font-bold text-white">VisitProfile Admin</h1>
                <p className="text-xs text-zinc-400">{profiles.length} profiles</p>
              </div>
              <Link
                href="/admin/requests"
                className="text-sm text-zinc-400 hover:text-white"
              >
                Signup requests
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm text-zinc-400 hover:text-white"
              >
                Analytics
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportJSON}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <Download className="size-4" /> Export JSON
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <ProfileGrid
            profiles={profiles}
            onEdit={slug => {
              const p = profiles.find(p => p.slug === slug);
              if (p) setEditing(p);
            }}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </div>
      </div>
    </>
  );
}
