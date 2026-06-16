"use client";
import type { ActionDraft } from "@/data/draft-types";
import { Field, inputCls, selectCls } from "@/components/admin/ui/field";

const ACTION_KINDS = [
  { value: "external", label: "External URL" },
  { value: "tel", label: "Phone call" },
  { value: "sms", label: "SMS" },
  { value: "mailto", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "maps", label: "Maps / directions" },
  { value: "download", label: "Download file" },
  { value: "vcard", label: "Save contact (vCard)" },
  { value: "share", label: "Share card" },
  { value: "section", label: "Open sheet / section" },
  { value: "none", label: "No action" },
] as const;

function blankAction(kind: string): ActionDraft {
  switch (kind) {
    case "external": return { kind: "external", href: "" };
    case "tel": return { kind: "tel", value: "" };
    case "sms": return { kind: "sms", value: "" };
    case "mailto": return { kind: "mailto", value: "" };
    case "whatsapp": return { kind: "whatsapp", value: "" };
    case "maps": return { kind: "maps", query: "" };
    case "download": return { kind: "download", href: "" };
    case "vcard": return { kind: "vcard" };
    case "share": return { kind: "share", data: { url: "", title: "" } };
    case "section": return { kind: "section", section: { type: "links", title: "New section", items: [] } };
    case "none": default: return { kind: "none" };
  }
}

interface ActionBuilderProps {
  value: ActionDraft;
  onChange: (action: ActionDraft) => void;
  onEditSection?: () => void;
}

export function ActionBuilder({ value, onChange, onEditSection }: ActionBuilderProps) {
  const kind = value.kind;

  const setKind = (k: string) => {
    if (k === kind) return;
    onChange(blankAction(k));
  };

  return (
    <div className="space-y-2">
      <Field label="Action type">
        <select className={selectCls} value={kind} onChange={e => setKind(e.target.value)}>
          {ACTION_KINDS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>

      {kind === "external" && (
        <Field label="URL">
          <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "external" }>).href ?? ""} placeholder="https://…"
            onChange={e => onChange({ kind: "external", href: e.target.value })} />
        </Field>
      )}
      {(kind === "tel" || kind === "sms" || kind === "facetime") && (
        <Field label="Phone number">
          <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "tel" }>).value ?? ""} placeholder="+1 555 000 0000"
            onChange={e => onChange({ kind, value: e.target.value } as ActionDraft)} />
        </Field>
      )}
      {kind === "mailto" && (
        <>
          <Field label="Email address">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "mailto" }>).value ?? ""} placeholder="hello@example.com"
              onChange={e => onChange({ kind: "mailto", value: e.target.value, subject: (value as Extract<ActionDraft, { kind: "mailto" }>).subject })} />
          </Field>
          <Field label="Subject (optional)">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "mailto" }>).subject ?? ""} placeholder="Subject line"
              onChange={e => onChange({ kind: "mailto", value: (value as Extract<ActionDraft, { kind: "mailto" }>).value, subject: e.target.value || undefined })} />
          </Field>
        </>
      )}
      {kind === "whatsapp" && (
        <>
          <Field label="Phone number">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "whatsapp" }>).value ?? ""} placeholder="+923001234567"
              onChange={e => onChange({ kind: "whatsapp", value: e.target.value, text: (value as Extract<ActionDraft, { kind: "whatsapp" }>).text })} />
          </Field>
          <Field label="Pre-filled message (optional)">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "whatsapp" }>).text ?? ""} placeholder="Hi, I came across your profile…"
              onChange={e => onChange({ kind: "whatsapp", value: (value as Extract<ActionDraft, { kind: "whatsapp" }>).value, text: e.target.value || undefined })} />
          </Field>
        </>
      )}
      {kind === "maps" && (
        <Field label="Search query or address">
          <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "maps" }>).query ?? ""} placeholder="123 Main St, City"
            onChange={e => onChange({ kind: "maps", query: e.target.value })} />
        </Field>
      )}
      {kind === "download" && (
        <>
          <Field label="File URL">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "download" }>).href ?? ""} placeholder="https://…/file.pdf"
              onChange={e => onChange({ kind: "download", href: e.target.value, filename: (value as Extract<ActionDraft, { kind: "download" }>).filename })} />
          </Field>
          <Field label="Filename (optional)">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "download" }>).filename ?? ""} placeholder="document.pdf"
              onChange={e => onChange({ kind: "download", href: (value as Extract<ActionDraft, { kind: "download" }>).href, filename: e.target.value || undefined })} />
          </Field>
        </>
      )}
      {kind === "share" && (
        <>
          <Field label="Share URL">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "share" }>).data?.url ?? ""} placeholder="https://…"
              onChange={e => onChange({ kind: "share", data: { url: e.target.value, title: (value as Extract<ActionDraft, { kind: "share" }>).data?.title ?? "" } })} />
          </Field>
          <Field label="Share title">
            <input className={inputCls} value={(value as Extract<ActionDraft, { kind: "share" }>).data?.title ?? ""} placeholder="Check out my profile"
              onChange={e => onChange({ kind: "share", data: { url: (value as Extract<ActionDraft, { kind: "share" }>).data?.url ?? "", title: e.target.value } })} />
          </Field>
        </>
      )}
      {kind === "section" && (
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-sm text-zinc-600">
            Section: <strong>{(value as Extract<ActionDraft, { kind: "section" }>).section?.type ?? "unknown"}</strong> — {(value as Extract<ActionDraft, { kind: "section" }>).section?.title ?? ""}
          </p>
          {onEditSection && (
            <button type="button" onClick={onEditSection}
              className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800">
              Edit section contents →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
