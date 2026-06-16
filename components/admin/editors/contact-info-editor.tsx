"use client";
import type { ProfileDraft } from "@/data/draft-types";
import { Field, inputCls } from "@/components/admin/ui/field";

interface Props { value: ProfileDraft; onChange: (p: ProfileDraft) => void; }

export function ContactInfoEditor({ value, onChange }: Props) {
  const set = (patch: Partial<typeof value.contact>) =>
    onChange({ ...value, contact: { ...value.contact, ...patch } });
  return (
    <div className="space-y-3">
      <Field label="Phone">
        <input className={inputCls} value={value.contact.phone ?? ""} placeholder="+1 555 000 0000"
          onChange={e => set({ phone: e.target.value || undefined })} />
      </Field>
      <Field label="Email">
        <input className={inputCls} value={value.contact.email ?? ""} placeholder="hello@example.com"
          onChange={e => set({ email: e.target.value || undefined })} />
      </Field>
      <Field label="WhatsApp number">
        <input className={inputCls} value={value.contact.whatsapp ?? ""} placeholder="+15550000000"
          onChange={e => set({ whatsapp: e.target.value || undefined })} />
      </Field>
    </div>
  );
}
