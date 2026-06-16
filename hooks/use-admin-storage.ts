"use client";
import { useState, useEffect, useCallback } from "react";
import type { ProfileDraft } from "@/data/draft-types";
import seedProfiles from "@/data/profiles.json";

const STORAGE_KEY = "admin_profiles";

export function useAdminStorage() {
  const [profiles, setProfiles] = useState<ProfileDraft[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setProfiles(JSON.parse(raw)); } catch { setProfiles(seedProfiles as ProfileDraft[]); }
    } else {
      setProfiles(seedProfiles as ProfileDraft[]);
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: ProfileDraft[]) => {
    setProfiles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const saveDraft = useCallback((draft: ProfileDraft) => {
    setProfiles(prev => {
      const idx = prev.findIndex(p => p.slug === draft.slug);
      const next = idx >= 0
        ? prev.map((p, i) => i === idx ? draft : p)
        : [...prev, draft];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteDraft = useCallback((slug: string) => {
    setProfiles(prev => {
      const next = prev.filter(p => p.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const exportJSON = useCallback(() => {
    setProfiles(prev => {
      const blob = new Blob([JSON.stringify(prev, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "profiles.json"; a.click();
      URL.revokeObjectURL(url);
      return prev;
    });
  }, []);

  return { profiles, loaded, saveDraft, deleteDraft, exportJSON, persist };
}
