"use client";
import { useState } from "react";
import type { ProfileDraft } from "@/data/draft-types";
import { Field, inputCls } from "@/components/admin/ui/field";

interface Props { value: ProfileDraft; onChange: (p: ProfileDraft) => void; }

export function PhotoEditor({ value, onChange }: Props) {
  const [imgError, setImgError] = useState(false);
  const set = (patch: Partial<typeof value.photo>) =>
    onChange({ ...value, photo: { ...value.photo, ...patch } });

  return (
    <div className="space-y-3">
      <Field label="Photo URL">
        <input className={inputCls} value={value.photo.src} placeholder="https://images.unsplash.com/…"
          onChange={e => { setImgError(false); set({ src: e.target.value }); }} />
      </Field>
      <Field label="Alt text">
        <input className={inputCls} value={value.photo.alt} placeholder="Portrait of Jane Smith"
          onChange={e => set({ alt: e.target.value })} />
      </Field>
      {value.photo.src && (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          {imgError
            ? <div className="flex h-20 items-center justify-center bg-zinc-100 text-xs text-zinc-400">Image failed to load</div>
            : <img src={value.photo.src} alt={value.photo.alt} className="h-20 w-full object-cover"
                onError={() => setImgError(true)} />
          }
        </div>
      )}
    </div>
  );
}
