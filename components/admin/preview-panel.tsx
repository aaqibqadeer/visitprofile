"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import type { ProfileDraft } from "@/data/draft-types";
import { resolveProfile } from "@/lib/icon-registry";
import { ProfileScreen } from "@/components/profile/profile-screen";

interface Props { draft: ProfileDraft; }

export function PreviewPanel({ draft }: Props) {
  const profile = useMemo(() => resolveProfile(draft), [draft]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const availH = el.clientHeight - 32;
      const availW = el.clientWidth - 32;
      const scaleByH = availH / window.innerHeight;
      const scaleByW = availW / 440;
      setScale(Math.min(scaleByH, scaleByW, 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex h-full items-start justify-center overflow-hidden pt-4">
      <div
        style={{
          width: 440,
          height: "100svh",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          flexShrink: 0,
          pointerEvents: "none",
          overflow: "hidden",
          boxShadow: "0 8px 48px rgba(0,0,0,0.18)",
        }}
      >
        <ProfileScreen profile={profile} preview />
      </div>
    </div>
  );
}
