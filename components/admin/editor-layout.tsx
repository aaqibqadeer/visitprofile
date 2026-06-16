"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, Save } from "lucide-react";
import type { ProfileDraft } from "@/data/draft-types";
import { EditorForm } from "./editor-form";
import { PreviewPanel } from "./preview-panel";

interface Props {
  initial: ProfileDraft;
  onSave: (draft: ProfileDraft) => void;
  onBack: () => void;
}

export function EditorLayout({ initial, onSave, onBack }: Props) {
  const [draft, setDraft] = useState<ProfileDraft>(initial);
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setDraft(initial);
    setUnsaved(false);
  }, [initial]);

  const handleChange = useCallback((next: ProfileDraft) => {
    setDraft(next);
    setUnsaved(true);
    clearTimeout(timerRef.current);
  }, []);

  const handleSave = () => {
    setSaving(true);
    onSave(draft);
    setTimeout(() => {
      setSaving(false);
      setUnsaved(false);
    }, 800);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-100">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="flex-1 px-2">
          <span className="text-sm font-semibold text-zinc-900">
            {draft.name.first} {draft.name.last}
          </span>
          <span className="ml-2 text-xs text-zinc-400">/{draft.slug}</span>
          {unsaved && (
            <span className="ml-2 text-xs font-medium text-amber-500">● Unsaved</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 lg:hidden"
        >
          {showPreview ? "Form" : "Preview"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          <Save className="size-3.5" />
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-full shrink-0 overflow-y-auto lg:w-[520px] ${showPreview ? "hidden lg:block" : ""}`}
        >
          <EditorForm draft={draft} onChange={handleChange} />
        </div>
        <div
          className={`flex-1 overflow-hidden bg-zinc-200 ${showPreview ? "" : "hidden lg:block"}`}
        >
          <PreviewPanel draft={draft} />
        </div>
      </div>
    </div>
  );
}
