import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { listAllProfiles } from "@/lib/supabase/profile-helpers";

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
  if (req.method !== "GET") return res.status(405).end();

  const supabase = getUserClient(req);
  const { data: { user } } = await supabase.auth.getUser();
  const role = (user?.user_metadata as { role?: string })?.role;
  if (!user || role !== "admin") return res.status(403).json({ error: "Forbidden" });

  const profiles = await listAllProfiles();
  return res.status(200).json(profiles);
}
