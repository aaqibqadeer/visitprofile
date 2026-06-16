import type { ProfileDraft } from "@/data/draft-types";
import { createServerClient, createAdminClient } from "./server";

type SupabaseRow = {
  id: string;
  slug: string;
  user_id: string | null;
  status: string;
  theme: string;
  readability: string;
  monogram: unknown;
  availability: unknown;
  name_first: string;
  name_last: string;
  role_title: string;
  company: string;
  tagline: string;
  location: string;
  timezone: string;
  photo_src: string;
  photo_alt: string;
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  featured: unknown;
  contacts: unknown;
  shortcuts: unknown;
  meta: unknown;
};

function rowToDraft(row: SupabaseRow): ProfileDraft {
  return {
    slug: row.slug,
    theme: row.theme as ProfileDraft["theme"],
    readability: row.readability as ProfileDraft["readability"],
    monogram: (row.monogram as ProfileDraft["monogram"]) ?? undefined,
    availability: (row.availability as ProfileDraft["availability"]) ?? undefined,
    name: { first: row.name_first, last: row.name_last },
    role: row.role_title,
    company: row.company,
    tagline: row.tagline,
    location: row.location,
    timezone: row.timezone,
    photo: { src: row.photo_src, alt: row.photo_alt },
    contact: {
      phone: row.contact_phone ?? undefined,
      email: row.contact_email ?? undefined,
      whatsapp: row.contact_whatsapp ?? undefined,
    },
    featured: (row.featured as ProfileDraft["featured"]) ?? undefined,
    contacts: (row.contacts as ProfileDraft["contacts"]) ?? [],
    shortcuts: (row.shortcuts as ProfileDraft["shortcuts"]) ?? [],
    meta: (row.meta as ProfileDraft["meta"]) ?? undefined,
  };
}

function draftToRow(draft: ProfileDraft, userId?: string) {
  return {
    slug: draft.slug,
    ...(userId ? { user_id: userId } : {}),
    theme: draft.theme,
    readability: draft.readability,
    monogram: draft.monogram ?? null,
    availability: draft.availability ?? null,
    name_first: draft.name.first,
    name_last: draft.name.last,
    role_title: draft.role,
    company: draft.company,
    tagline: draft.tagline,
    location: draft.location,
    timezone: draft.timezone,
    photo_src: draft.photo.src,
    photo_alt: draft.photo.alt,
    contact_phone: draft.contact.phone ?? null,
    contact_email: draft.contact.email ?? null,
    contact_whatsapp: draft.contact.whatsapp ?? null,
    featured: draft.featured ?? null,
    contacts: draft.contacts,
    shortcuts: draft.shortcuts,
    meta: draft.meta ?? null,
  };
}

/** Fetch a single approved profile by slug (public, uses anon key). */
export async function getProfileBySlug(slug: string): Promise<ProfileDraft | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error || !data) return null;
  return rowToDraft(data as SupabaseRow);
}

/** Get all approved slugs for getStaticPaths. */
export async function getAllApprovedSlugs(): Promise<string[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("slug")
    .eq("status", "approved");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

/** Get first approved profile (for the site root). */
export async function getFirstApprovedProfile(): Promise<ProfileDraft | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(1);
  if (!data || data.length === 0) return null;
  return rowToDraft(data[0] as SupabaseRow);
}

/** Admin: list all profiles (any status). */
export async function listAllProfiles(): Promise<(ProfileDraft & { status: string; userId: string | null })[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []).map((r: SupabaseRow) => ({
    ...rowToDraft(r),
    status: r.status,
    userId: r.user_id,
  }));
}

/** Upsert a profile (admin or user updating their own). */
export async function upsertProfile(draft: ProfileDraft, userId?: string): Promise<void> {
  const supabase = createAdminClient();
  const row = draftToRow(draft, userId);
  await supabase.from("profiles").upsert(row, { onConflict: "slug" });
}

/** Archive a profile (soft delete). */
export async function archiveProfile(slug: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ status: "archived" }).eq("slug", slug);
}

/** Get profile by user_id (for dashboard). */
export async function getProfileByUserId(userId: string): Promise<ProfileDraft | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  return rowToDraft(data as SupabaseRow);
}
