import type { Profile } from "@/data/types";
import { maya } from "./maya";
import { devon } from "./devon";
import { aria } from "./aria";
import { leo } from "./leo";
import { sofia } from "./sofia";
import { noah } from "./noah";
import { priya } from "./priya";
import { kai } from "./kai";
import { zara } from "./zara";

/**
 * User registry. Each profile is served at `/<slug>` (e.g. `/user1`). The first
 * entry is also the site root (`/`).
 */
export const users: Profile[] = [maya, devon, aria, leo, sofia, noah, priya, kai, zara];

const bySlug = new Map(users.map((u) => [u.slug, u]));

export function getUser(slug: string): Profile | undefined {
  return bySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return users.map((u) => u.slug);
}

export const defaultUser = users[0];
