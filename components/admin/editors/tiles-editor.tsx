"use client";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { Trash2, GripVertical, Plus } from "lucide-react";
import type { LinkItemDraft } from "@/data/draft-types";
import { LinkItemEditor } from "./link-item-editor";

const DEFAULT_ITEM: LinkItemDraft = {
  iconKey: "Phone",
  label: "Contact",
  action: { kind: "none" },
};

interface Props {
  value: LinkItemDraft[];
  onChange: (items: LinkItemDraft[]) => void;
  label?: string;
}

export function TilesEditor({ value, onChange, label = "Tile" }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const add = () => {
    const next = [...value, { ...DEFAULT_ITEM }];
    onChange(next);
    setExpanded(next.length - 1);
  };

  const remove = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
    setExpanded(null);
  };

  const update = (i: number, item: LinkItemDraft) =>
    onChange(value.map((v, idx) => idx === i ? item : v));

  return (
    <div className="space-y-2">
      <Reorder.Group axis="y" values={value} onReorder={onChange} className="space-y-2">
        {value.map((item, i) => (
          <Reorder.Item key={item.label + i} value={item}>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2 px-3 py-2">
                <GripVertical className="size-4 shrink-0 cursor-grab text-zinc-300 active:cursor-grabbing" />
                <button type="button" className="flex-1 text-left text-sm font-medium text-zinc-800"
                  onClick={() => setExpanded(expanded === i ? null : i)}>
                  {item.label || `${label} ${i + 1}`}
                </button>
                <button type="button" onClick={() => remove(i)}
                  className="text-zinc-400 hover:text-red-500">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              {expanded === i && (
                <div className="border-t border-zinc-100 px-3 pb-3 pt-2">
                  <LinkItemEditor value={item} onChange={updated => update(i, updated)} />
                </div>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button type="button" onClick={add}
        className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700">
        <Plus className="size-4" /> Add {label}
      </button>
    </div>
  );
}
