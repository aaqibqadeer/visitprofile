import type { NextApiRequest, NextApiResponse } from "next";
import { recordView } from "@/lib/supabase/analytics-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { slug, referrer, device_type, session_id } = req.body as {
    slug: string;
    referrer?: string;
    device_type?: string;
    session_id?: string;
  };

  if (!slug) return res.status(400).json({ error: "slug required" });

  // Derive country from Cloudflare or Vercel header — never store IP
  const country_code =
    (req.headers["cf-ipcountry"] as string | undefined) ??
    (req.headers["x-vercel-ip-country"] as string | undefined) ??
    undefined;

  await recordView({ slug, referrer, device_type, country_code, session_id });
  res.status(204).end();
}
