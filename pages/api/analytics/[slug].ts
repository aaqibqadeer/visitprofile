import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { getProfileAnalytics } from "@/lib/supabase/analytics-helpers";
import { getProfileByUserId } from "@/lib/supabase/profile-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const supabase = createServerClient(
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const slug = req.query.slug as string;
  const role = (user.user_metadata as { role?: string })?.role;

  // Non-admin users can only see their own profile
  if (role !== "admin") {
    const ownProfile = await getProfileByUserId(user.id);
    if (!ownProfile || ownProfile.slug !== slug) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  const stats = await getProfileAnalytics(slug);
  res.json(stats);
}
