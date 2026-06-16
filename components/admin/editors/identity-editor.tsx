"use client";
import type { ProfileDraft } from "@/data/draft-types";
import { Field, inputCls } from "@/components/admin/ui/field";

interface Props { value: ProfileDraft; onChange: (p: ProfileDraft) => void; }

export function IdentityEditor({ value, onChange }: Props) {
  const set = (patch: Partial<ProfileDraft>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name">
          <input className={inputCls} value={value.name.first} placeholder="Jane"
            onChange={e => set({ name: { ...value.name, first: e.target.value } })} />
        </Field>
        <Field label="Last name">
          <input className={inputCls} value={value.name.last} placeholder="Smith"
            onChange={e => set({ name: { ...value.name, last: e.target.value } })} />
        </Field>
      </div>
      <Field label="Slug (URL)">
        <input className={inputCls} value={value.slug} placeholder="user10"
          onChange={e => set({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
      </Field>
      <Field label="Role / title">
        <input className={inputCls} value={value.role} placeholder="Designer & Engineer"
          onChange={e => set({ role: e.target.value })} />
      </Field>
      <Field label="Company / studio">
        <input className={inputCls} value={value.company} placeholder="Acme Corp"
          onChange={e => set({ company: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <input className={inputCls} value={value.tagline} placeholder="One sentence about you"
          onChange={e => set({ tagline: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location">
          <input className={inputCls} value={value.location} placeholder="New York"
            onChange={e => set({ location: e.target.value })} />
        </Field>
        <Field label="Timezone">
          <input className={inputCls} value={value.timezone} placeholder="EST"
            onChange={e => set({ timezone: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Monogram">
          <input className={inputCls} value={value.monogram ?? ""} placeholder="JS" maxLength={3}
            onChange={e => set({ monogram: e.target.value })} />
        </Field>
        <Field label="Availability badge">
          <input className={inputCls} value={value.availability ?? ""} placeholder="Open to work"
            onChange={e => set({ availability: e.target.value || undefined })} />
        </Field>
      </div>
    </div>
  );
}
