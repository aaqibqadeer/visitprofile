"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { ProfileDraft } from "@/data/draft-types";
import { themes } from "@/data/themes";

interface Props {
  profile: ProfileDraft;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileCardThumb({ profile, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = themes[profile.theme].tokens;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="h-2" style={{ background: t.accent }} />
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="font-semibold text-zinc-900">
              {profile.name.first} {profile.name.last}
            </p>
            <p className="text-sm text-zinc-500">{profile.role}</p>
            <p className="text-xs text-zinc-400">{profile.company}</p>
          </div>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: t.accent }}
          >
            {profile.monogram?.content.type === "text"
              ? profile.monogram.content.value.slice(0, 2)
              : profile.name.first[0] || "?"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600">
            {profile.theme}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600">
            /{profile.slug}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
          >
            <Pencil className="size-3" /> Edit
          </button>
          {confirmDelete ? (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg bg-red-500 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg border border-zinc-200 px-2 py-1.5 text-zinc-500 hover:border-red-200 hover:text-red-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
