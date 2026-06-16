import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminClient } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name_first, name_last, email, phone, company, role_title, tagline, location, photo_src, photo_alt } =
    req.body as Record<string, string>;

  if (!name_first || !name_last || !email || !phone) {
    return res.status(400).json({ error: "name_first, name_last, email, and phone are required" });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("signup_requests").insert({
    name_first,
    name_last,
    email,
    phone,
    company: company || null,
    role_title: role_title || null,
    tagline: tagline || null,
    location: location || null,
    photo_src: photo_src || null,
    photo_alt: photo_alt || null,
  });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ ok: true });
}
