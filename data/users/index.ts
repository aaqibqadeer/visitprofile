import type { Profile } from "@/data/types";
import type { ProfileDraft } from "@/data/draft-types";
import { resolveProfile } from "@/lib/icon-registry";
import drafts from "@/data/profiles.json";

/**
 * User registry. Each profile is served at `/<slug>` (e.g. `/user1`). The first
 * entry is also the site root (`/`).
 */
export const users: Profile[] = (drafts as ProfileDraft[]).map(resolveProfile);

const bySlug = new Map(users.map((u) => [u.slug, u]));

export function getUser(slug: string): Profile | undefined {
  return bySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return users.map((u) => u.slug);
}

export const defaultUser = users[0];
