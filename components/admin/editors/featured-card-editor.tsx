"use client";
import type { ProfileDraft } from "@/data/draft-types";
import { LinkItemEditor } from "./link-item-editor";

const DEFAULT_FEATURED = {
  iconKey: "Star" as const,
  label: "Featured",
  action: { kind: "none" as const },
};

interface Props { value: ProfileDraft; onChange: (p: ProfileDraft) => void; }

export function FeaturedCardEditor({ value, onChange }: Props) {
  const enabled = !!value.featured;
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="rounded border-zinc-300"
          checked={enabled}
          onChange={e =>
            onChange({ ...value, featured: e.target.checked ? DEFAULT_FEATURED : undefined })
          }
        />
        <span className="text-sm text-zinc-800">Show featured card</span>
      </label>
      {enabled && value.featured && (
        <LinkItemEditor
          value={value.featured}
          onChange={featured => onChange({ ...value, featured })}
        />
      )}
    </div>
  );
}
