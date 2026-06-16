import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/server";
import { upsertProfile } from "@/lib/supabase/profile-helpers";

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

function slugFromName(first: string, last: string): string {
  return `${first}-${last}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const supabaseUser = getUserClient(req);
  const { data: { user: adminUser } } = await supabaseUser.auth.getUser();
  const role = (adminUser?.user_metadata as { role?: string })?.role;
  if (!adminUser || role !== "admin") return res.status(403).json({ error: "Forbidden" });

  const { id } = req.query as { id: string };
  const { temp_password } = req.body as { temp_password: string };

  if (!temp_password || temp_password.length < 8) {
    return res.status(400).json({ error: "temp_password must be at least 8 characters" });
  }

  const supabase = createAdminClient();

  // Fetch the signup request
  const { data: request, error: fetchErr } = await supabase
    .from("signup_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !request) return res.status(404).json({ error: "Request not found" });
  if (request.status !== "pending") return res.status(409).json({ error: "Already processed" });

  // Create auth user
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email: request.email,
    password: temp_password,
    email_confirm: true,
    user_metadata: { role: "user" },
  });

  if (authErr || !authData.user) {
    return res.status(500).json({ error: authErr?.message ?? "Failed to create user" });
  }

  const newUserId = authData.user.id;

  // Generate a unique slug from name
  let slug = slugFromName(request.name_first, request.name_last);
  const { data: existing } = await supabase
    .from("profiles")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${slug}-${Date.now()}`;

  // Create profile from request data
  await upsertProfile(
    {
      slug,
      theme: "paper",
      readability: "none",
      name: { first: request.name_first, last: request.name_last },
      role: request.role_title ?? "",
      company: "",
      tagline: request.tagline ?? "",
      location: request.location ?? "",
      timezone: "",
      photo: { src: request.photo_src ?? "", alt: request.photo_alt ?? request.name_first },
      contact: { email: request.email, phone: request.phone },
      contacts: [],
      shortcuts: [],
    },
    newUserId
  );

  // Mark request approved
  await supabase.from("signup_requests").update({
    status: "approved",
    temp_password,
    approved_by: adminUser.id,
    approved_at: new Date().toISOString(),
  }).eq("id", id);

  return res.status(200).json({ ok: true, slug, temp_password });
}
