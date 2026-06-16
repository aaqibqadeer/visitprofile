"use client";
import { Plus } from "lucide-react";
import type { ProfileDraft } from "@/data/draft-types";
import { ProfileCardThumb } from "./profile-card-thumb";

interface Props {
  profiles: ProfileDraft[];
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
  onCreate: () => void;
}

export function ProfileGrid({ profiles, onEdit, onDelete, onCreate }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {profiles.map(p => (
        <ProfileCardThumb
          key={p.slug}
          profile={p}
          onEdit={() => onEdit(p.slug)}
          onDelete={() => onDelete(p.slug)}
        />
      ))}
      <button
        type="button"
        onClick={onCreate}
        className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 text-zinc-400 hover:border-indigo-400 hover:text-indigo-500"
      >
        <Plus className="size-6" />
        <span className="text-sm font-medium">New profile</span>
      </button>
    </div>
  );
}
