"use client";
import type { LinkItemDraft } from "@/data/draft-types";
import { TilesEditor } from "./tiles-editor";

interface Props { value: LinkItemDraft[]; onChange: (items: LinkItemDraft[]) => void; }

export function ShortcutsEditor({ value, onChange }: Props) {
  return <TilesEditor value={value} onChange={onChange} label="Shortcut" />;
}
