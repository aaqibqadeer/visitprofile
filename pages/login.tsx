import Head from "next/head";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const next = (router.query.next as string) ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr || !data.user) {
      setError(authErr?.message ?? "Login failed");
      setLoading(false);
      return;
    }

    const role = (data.user.user_metadata as { role?: string })?.role;
    const destination = role === "admin" ? "/admin" : next === "/dashboard" ? "/dashboard" : next;
    router.push(destination);
  };

  return (
    <>
      <Head>
        <title>Sign in · VisitProfile</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-bold text-zinc-900">Sign in</h1>
          <p className="mb-6 text-sm text-zinc-500">
            New here?{" "}
            <a href="/signup" className="font-medium text-indigo-600 hover:underline">
              Request access
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
