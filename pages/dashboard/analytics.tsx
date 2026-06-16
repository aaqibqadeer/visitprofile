import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { withAuth } from "@/lib/with-auth";
import { getProfileByUserId } from "@/lib/supabase/profile-helpers";
import { getProfileAnalytics } from "@/lib/supabase/analytics-helpers";
import type { ProfileStats } from "@/lib/supabase/analytics-helpers";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  user: { id: string; email: string; role: "user" | "admin" };
  slug: string | null;
  stats: ProfileStats | null;
}


export default function AnalyticsPage({ slug, stats }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Analytics · VisitProfile</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <nav className="border-b border-zinc-800 px-6 py-3">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/billing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Billing
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="mb-2 text-2xl font-bold">Analytics</h1>
          {slug && (
            <p className="mb-8 text-sm text-zinc-500">
              Profile: <span className="text-zinc-300">/{slug}</span> · Last 30 days
            </p>
          )}

          {!slug && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-500">
              No profile found. Your analytics will appear here once your profile is set up.
            </div>
          )}

          {stats && (
            <>
              {/* Summary cards */}
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total views" value={stats.totalViews} />
                <StatCard label="Unique sessions" value={stats.uniqueSessions} />
                <StatCard label="Top referrer" value={stats.topReferrers[0]?.domain ?? "—"} />
                <StatCard
                  label="Top country"
                  value={stats.topCountries[0]?.code ?? "—"}
                />
              </div>

              {/* Views by day */}
              {stats.viewsByDay.length > 0 && (
                <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <h2 className="mb-4 text-sm font-semibold text-zinc-300">Views over time</h2>
                  <SimpleBarChart data={stats.viewsByDay} />
                </section>
              )}

              {/* Three columns */}
              <div className="grid gap-6 sm:grid-cols-3">
                {/* Device split */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="mb-4 text-sm font-semibold text-zinc-300">Devices</h2>
                  <DeviceBar label="Mobile" count={stats.deviceSplit.mobile} total={stats.totalViews} />
                  <DeviceBar label="Desktop" count={stats.deviceSplit.desktop} total={stats.totalViews} />
                  <DeviceBar label="Tablet" count={stats.deviceSplit.tablet} total={stats.totalViews} />
                </section>

                {/* Top referrers */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="mb-4 text-sm font-semibold text-zinc-300">Referrers</h2>
                  {stats.topReferrers.length === 0 && (
                    <p className="text-sm text-zinc-600">No referrer data yet.</p>
                  )}
                  {stats.topReferrers.map((r) => (
                    <div key={r.domain} className="mb-2 flex items-center justify-between text-sm">
                      <span className="truncate text-zinc-300">{r.domain || "Direct"}</span>
                      <span className="ml-4 shrink-0 text-zinc-500">{r.count}</span>
                    </div>
                  ))}
                </section>

                {/* Top links */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="mb-4 text-sm font-semibold text-zinc-300">Link clicks</h2>
                  {stats.topLinks.length === 0 && (
                    <p className="text-sm text-zinc-600">No click data yet.</p>
                  )}
                  {stats.topLinks.slice(0, 6).map((l) => (
                    <div key={`${l.label}-${l.kind}`} className="mb-2 flex items-center justify-between text-sm">
                      <span className="truncate text-zinc-300">{l.label}</span>
                      <span className="ml-4 shrink-0 text-zinc-500">{l.count}</span>
                    </div>
                  ))}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-1 text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function DeviceBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-500">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-zinc-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SimpleBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const last14 = data.slice(-14);
  return (
    <div className="flex h-24 items-end gap-1">
      {last14.map((d) => (
        <div key={d.date} className="group relative flex flex-1 flex-col items-center">
          <div
            className="w-full rounded-t bg-zinc-600 group-hover:bg-zinc-400 transition-colors"
            style={{ height: `${(d.count / max) * 100}%` }}
            title={`${d.date}: ${d.count} views`}
          />
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  "user",
  async (_ctx, user): Promise<{ props: { slug: string | null; stats: ProfileStats | null } }> => {
    const profile = await getProfileByUserId(user.id);
    if (!profile) return { props: { slug: null, stats: null } };
    const stats = await getProfileAnalytics(profile.slug);
    return { props: { slug: profile.slug, stats } };
  }
);
