import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient as createSBServer } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

function getSupabaseFromRequest(req: NextApiRequest) {
  return createSBServer(
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
  if (req.method !== "POST") return res.status(405).end();

  // Verify authenticated
  const supabaseUser = getSupabaseFromRequest(req);
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10MB
  const [, files] = await form.parse(req);
  const file = Array.isArray(files.file) ? files.file[0] : files.file;

  if (!file) return res.status(400).json({ error: "No file provided" });

  const ext = path.extname(file.originalFilename ?? ".jpg");
  const filename = `${user.id}/${Date.now()}${ext}`;
  const fileBuffer = fs.readFileSync(file.filepath);

  const supabase = createAdminClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "profile-images";

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, fileBuffer, {
      contentType: file.mimetype ?? "image/jpeg",
      upsert: true,
    });

  if (error) return res.status(500).json({ error: error.message });

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);

  return res.status(200).json({ url: publicUrl });
}
