import Head from "next/head";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { withAuth } from "@/lib/with-auth";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";

interface Props {
  user: { id: string; email: string; role: "user" | "admin" };
}

export default function ChangePasswordPage({ user }: Props) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authErr } = await supabase.auth.updateUser({ password: newPassword });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const inputCls =
    "h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <>
      <Head><title>Change password · VisitProfile</title></Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4">
        <div className="w-full max-w-sm">
          <a href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="size-4" /> Back to profile
          </a>
          <h1 className="mb-6 text-2xl font-bold text-zinc-900">Change password</h1>
          <p className="mb-4 text-xs text-zinc-400">Signed in as {user.email}</p>

          {success ? (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Password updated! Redirecting…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  New password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={inputCls}
                  placeholder="Repeat password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(null, async () => {
  return { props: {} };
});
