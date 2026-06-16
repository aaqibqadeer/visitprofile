import type { NextApiRequest, NextApiResponse } from "next";
import { recordClick } from "@/lib/supabase/analytics-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { slug, link_label, link_kind, session_id } = req.body as {
    slug: string;
    link_label: string;
    link_kind: string;
    session_id?: string;
  };

  if (!slug || !link_label || !link_kind) {
    return res.status(400).json({ error: "slug, link_label, link_kind required" });
  }

  await recordClick({ slug, link_label, link_kind, session_id });
  res.status(204).end();
}
