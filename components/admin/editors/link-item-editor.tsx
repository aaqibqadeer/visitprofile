"use client";
import type { LinkItemDraft } from "@/data/draft-types";
import { Field, inputCls } from "@/components/admin/ui/field";
import { IconPicker } from "./icon-picker";
import { ActionBuilder } from "./action-builder";

interface LinkItemEditorProps {
  value: LinkItemDraft;
  onChange: (item: LinkItemDraft) => void;
}

export function LinkItemEditor({ value, onChange }: LinkItemEditorProps) {
  const set = (patch: Partial<LinkItemDraft>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Icon">
          <IconPicker value={value.iconKey} onChange={iconKey => set({ iconKey })} />
        </Field>
        <Field label="Label">
          <input className={inputCls} value={value.label} placeholder="Button label"
            onChange={e => set({ label: e.target.value })} />
        </Field>
      </div>
      <Field label="Sublabel (optional)">
        <input className={inputCls} value={value.sublabel ?? ""} placeholder="Secondary text"
          onChange={e => set({ sublabel: e.target.value || undefined })} />
      </Field>
      <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Action</p>
        <ActionBuilder value={value.action} onChange={action => set({ action })} />
      </div>
    </div>
  );
}
