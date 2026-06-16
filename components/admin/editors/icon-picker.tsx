"use client";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { ICON_REGISTRY } from "@/lib/icon-registry";
import type { IconKey } from "@/data/draft-types";
import { cn } from "@/lib/utils";

const LUCIDE_KEYS: IconKey[] = [
  "Phone","Mail","MessageSquare","Globe","FileText","Star","Briefcase","Users",
  "HelpCircle","Calendar","Video","Download","BookOpen","Music","Mic","Ticket",
  "Map","MapPin","Image","Images","Camera","ShoppingBag","Utensils","Clock","CreditCard",
];
const BRAND_KEYS: IconKey[] = [
  "LinkedInIcon","InstagramIcon","FacebookIcon","XIcon","YouTubeIcon",
  "TikTokIcon","WhatsAppIcon","GitHubIcon","DribbbleIcon","BehanceIcon",
];
const DISPLAY_LABELS: Partial<Record<IconKey, string>> = {
  LinkedInIcon:"LinkedIn", InstagramIcon:"Instagram", FacebookIcon:"Facebook",
  XIcon:"X (Twitter)", YouTubeIcon:"YouTube", TikTokIcon:"TikTok",
  WhatsAppIcon:"WhatsApp", GitHubIcon:"GitHub", DribbbleIcon:"Dribbble",
  BehanceIcon:"Behance",
};

interface IconPickerProps {
  value: IconKey;
  onChange: (key: IconKey) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = (k: IconKey) => DISPLAY_LABELS[k] ?? k;
  const filter = (keys: IconKey[]) =>
    search ? keys.filter(k => label(k).toLowerCase().includes(search.toLowerCase())) : keys;

  const SelectedIcon = ICON_REGISTRY[value];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 hover:border-zinc-300"
      >
        <SelectedIcon className="size-4 shrink-0" />
        <span className="truncate">{label(value)}</span>
        <span className="ml-auto text-zinc-400">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-50 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              autoFocus
              placeholder="Search icons…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-zinc-200 pl-8 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filter(LUCIDE_KEYS).length > 0 && (
              <>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">General</p>
                <div className="mb-3 grid grid-cols-6 gap-1">
                  {filter(LUCIDE_KEYS).map(k => {
                    const Icon = ICON_REGISTRY[k];
                    return (
                      <button
                        key={k}
                        type="button"
                        title={label(k)}
                        onClick={() => { onChange(k); setOpen(false); setSearch(""); }}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-lg hover:bg-indigo-50",
                          value === k && "bg-indigo-100 text-indigo-600"
                        )}
                      >
                        <Icon className="size-4" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {filter(BRAND_KEYS).length > 0 && (
              <>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">Brand</p>
                <div className="grid grid-cols-6 gap-1">
                  {filter(BRAND_KEYS).map(k => {
                    const Icon = ICON_REGISTRY[k];
                    return (
                      <button
                        key={k}
                        type="button"
                        title={label(k)}
                        onClick={() => { onChange(k); setOpen(false); setSearch(""); }}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-lg hover:bg-indigo-50",
                          value === k && "bg-indigo-100 text-indigo-600"
                        )}
                      >
                        <Icon className="size-4" />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
