import Head from "next/head";
import { useState } from "react";
import { Download } from "lucide-react";
import type { ProfileDraft } from "@/data/draft-types";
import { BLANK_PROFILE } from "@/data/draft-types";
import { useAdminStorage } from "@/hooks/use-admin-storage";
import { ProfileGrid } from "@/components/admin/profile-grid";
import { EditorLayout } from "@/components/admin/editor-layout";

export default function AdminPage() {
  const { profiles, loaded, saveDraft, deleteDraft, exportJSON } = useAdminStorage();
  const [editing, setEditing] = useState<ProfileDraft | null>(null);

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
        onSave={draft => {
          saveDraft(draft);
          setEditing(draft);
        }}
        onBack={() => setEditing(null)}
      />
    );
  }

  const handleCreate = () => {
    const blank: ProfileDraft = {
      ...BLANK_PROFILE,
      slug: `user${profiles.length + 1}`,
    };
    setEditing(blank);
  };

  const handleEdit = (slug: string) => {
    const p = profiles.find(p => p.slug === slug);
    if (p) setEditing(p);
  };

  return (
    <>
      <Head>
        <title>Admin · VisitProfile</title>
      </Head>
      <div className="min-h-screen bg-zinc-100">
        <div className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">VisitProfile Admin</h1>
              <p className="text-xs text-zinc-400">{profiles.length} profiles</p>
            </div>
            <button
              type="button"
              onClick={exportJSON}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Download className="size-4" /> Export JSON
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <ProfileGrid
            profiles={profiles}
            onEdit={handleEdit}
            onDelete={deleteDraft}
            onCreate={handleCreate}
          />
        </div>
      </div>
    </>
  );
}
