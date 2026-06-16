"use client";
import type { Badge, BadgeSize, BadgeContent } from "@/data/draft-types";
import { Field, inputCls, selectCls } from "@/components/admin/ui/field";

const SIZES: { value: BadgeSize; label: string }[] = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "m", label: "M (default)" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "XL" },
];

interface BadgeEditorProps {
  label: string;
  value: Badge | undefined;
  onChange: (badge: Badge | undefined) => void;
}

const DEFAULT_BADGE: Badge = { content: { type: "text", value: "" }, size: "m" };

export function BadgeEditor({ label, value, onChange }: BadgeEditorProps) {
  const enabled = !!value;
  const badge = value ?? DEFAULT_BADGE;
  const content: BadgeContent = badge.content;

  const set = (patch: Partial<Badge>) => onChange({ ...badge, ...patch });

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          className="rounded border-zinc-300"
          checked={enabled}
          onChange={e => onChange(e.target.checked ? DEFAULT_BADGE : undefined)}
        />
        <span className="text-sm font-medium text-zinc-800">{label}</span>
      </label>

      {enabled && (
        <div className="ml-6 space-y-2 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Type">
              <select
                className={selectCls}
                value={content.type}
                onChange={e => {
                  const t = e.target.value as "text" | "image";
                  set({
                    content:
                      t === "text"
                        ? { type: "text", value: "" }
                        : { type: "image", src: "", alt: "" },
                  });
                }}
              >
                <option value="text">Text</option>
                <option value="image">Image / Logo</option>
              </select>
            </Field>
            <Field label="Size">
              <select
                className={selectCls}
                value={badge.size ?? "m"}
                onChange={e => set({ size: e.target.value as BadgeSize })}
              >
                {SIZES.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {content.type === "text" ? (
            <Field label="Text value">
              <input
                className={inputCls}
                value={content.value}
                placeholder="e.g. M·O or Available"
                onChange={e => set({ content: { type: "text", value: e.target.value } })}
              />
            </Field>
          ) : (
            <>
              <Field label="Image URL">
                <input
                  className={inputCls}
                  value={content.src}
                  placeholder="https://… (PNG, SVG, logo)"
                  onChange={e =>
                    set({ content: { type: "image", src: e.target.value, alt: content.alt } })
                  }
                />
              </Field>
              <Field label="Alt text">
                <input
                  className={inputCls}
                  value={content.alt ?? ""}
                  placeholder="Logo description"
                  onChange={e =>
                    set({ content: { type: "image", src: content.src, alt: e.target.value || undefined } })
                  }
                />
              </Field>
              {content.src && (
                <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-800 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={content.src} alt={content.alt ?? ""} className="h-8 w-auto object-contain" />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
