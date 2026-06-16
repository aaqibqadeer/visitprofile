"use client";
import type { ProfileDraft } from "@/data/draft-types";
import type { ThemeName, ReadabilityMode, Theme } from "@/data/themes";
import { themes } from "@/data/themes";

const themeMap = themes as Record<ThemeName, Theme>;
import { Field, selectCls } from "@/components/admin/ui/field";
import { cn } from "@/lib/utils";

interface Props { value: ProfileDraft; onChange: (p: ProfileDraft) => void; }

const READABILITY: { value: ReadabilityMode; label: string }[] = [
  { value: "none", label: "None" },
  { value: "shadow", label: "Shadow" },
  { value: "plate", label: "Plate" },
  { value: "scrim", label: "Scrim" },
];

export function AppearanceEditor({ value, onChange }: Props) {
  const themeNames = Object.keys(themes) as ThemeName[];

  return (
    <div className="space-y-4">
      <Field label="Theme">
        <div className="grid grid-cols-4 gap-2">
          {themeNames.map(name => {
            const t = themeMap[name].tokens;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange({ ...value, theme: name })}
                className={cn(
                  "rounded-lg border-2 p-2 text-left transition-all",
                  value.theme === name ? "border-indigo-500 shadow-md" : "border-transparent hover:border-zinc-200"
                )}
              >
                <div className="mb-1.5 h-8 rounded-md" style={{ background: t.paper }} />
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ background: t.accent }} />
                  <div className="h-2 w-2 rounded-full" style={{ background: t.ink }} />
                </div>
                <p className="mt-1 text-[10px] font-medium capitalize text-zinc-600">{name}</p>
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Readability mode" hint="How hero text stays legible over the photo">
        <select className={selectCls} value={value.readability}
          onChange={e => onChange({ ...value, readability: e.target.value as ReadabilityMode })}>
          {READABILITY.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
    </div>
  );
}
