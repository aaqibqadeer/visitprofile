import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/server";

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

  const supabaseUser = getUserClient(req);
  const { data: { user } } = await supabaseUser.auth.getUser();
  const role = (user?.user_metadata as { role?: string })?.role;
  if (!user || role !== "admin") return res.status(403).json({ error: "Forbidden" });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("signup_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(data);
}
