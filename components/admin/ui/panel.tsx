"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Panel({ title, defaultOpen = false, children }: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        <ChevronDown className={cn("size-4 text-zinc-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-zinc-100 px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}
