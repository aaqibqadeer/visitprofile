import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProfileDraft } from "@/data/draft-types";

function getUserClient(req: NextApiRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies
            ? Object.entries(req.cookies).map(([name, value]) => ({ name, value: value ?? "" }))
            : [];
        },
        setAll() {},
      },
    }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end();

  const supabase = getUserClient(req);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { slug } = req.query as { slug: string };

  // Ensure user owns this profile
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("user_id")
    .eq("slug", slug)
    .single();

  if (!profile || profile.user_id !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const draft = req.body as ProfileDraft;

  const { error } = await admin.from("profiles").update({
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
  }).eq("slug", slug).eq("user_id", user.id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true });
}
