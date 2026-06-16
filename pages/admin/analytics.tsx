import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { withAuth } from "@/lib/with-auth";
import { getSiteAnalytics, getProfileAnalytics } from "@/lib/supabase/analytics-helpers";
import type { SiteStats, ProfileStats } from "@/lib/supabase/analytics-helpers";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  user: { id: string; email: string; role: "user" | "admin" };
  siteStats: SiteStats;
}

export default function AdminAnalyticsPage({ siteStats }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const handleSelectProfile = async (slug: string) => {
    if (selected === slug) {
      setSelected(null);
      setProfileStats(null);
      return;
    }
    setLoadingSlug(slug);
    const res = await fetch(`/api/analytics/${slug}`);
    const data = (await res.json()) as ProfileStats;
    setProfileStats(data);
    setSelected(slug);
    setLoadingSlug(null);
  };

  return (
    <>
      <Head>
        <title>Analytics · Admin · VisitProfile</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <nav className="border-b border-zinc-800 px-6 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-sm font-semibold text-zinc-100">
                VisitProfile Admin
              </Link>
              <Link href="/admin" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Profiles
              </Link>
              <Link href="/admin/requests" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Requests
              </Link>
              <span className="text-sm font-medium text-zinc-100">Analytics</span>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12">
          <h1 className="mb-8 text-2xl font-bold">Site Analytics</h1>

          {/* Summary */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-1 text-xs text-zinc-500">Total views (30d)</p>
              <p className="text-2xl font-bold">{siteStats.totalViews}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-1 text-xs text-zinc-500">Active profiles</p>
              <p className="text-2xl font-bold">{siteStats.totalProfiles}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-1 text-xs text-zinc-500">Profiles with views</p>
              <p className="text-2xl font-bold">{siteStats.profileSummary.length}</p>
            </div>
          </div>

          {/* Per-profile table */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="text-sm font-semibold text-zinc-300">Per-profile breakdown</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                  <th className="px-6 py-3 font-medium">Profile</th>
                  <th className="px-6 py-3 font-medium">Views</th>
                  <th className="px-6 py-3 font-medium">Sessions</th>
                  <th className="px-6 py-3 font-medium">Last viewed</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {siteStats.profileSummary.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-600">
                      No view data yet.
                    </td>
                  </tr>
                )}
                {siteStats.profileSummary.map((p) => (
                  <>
                    <tr
                      key={p.slug}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      onClick={() => void handleSelectProfile(p.slug)}
                    >
                      <td className="px-6 py-3 text-zinc-200">/{p.slug}</td>
                      <td className="px-6 py-3 text-zinc-400">{p.total_views}</td>
                      <td className="px-6 py-3 text-zinc-400">{p.unique_sessions}</td>
                      <td className="px-6 py-3 text-zinc-500">
                        {p.last_viewed
                          ? new Date(p.last_viewed).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-3 text-zinc-500">
                        {loadingSlug === p.slug ? "Loading…" : selected === p.slug ? "▲" : "▼"}
                      </td>
                    </tr>
                    {selected === p.slug && profileStats && (
                      <tr key={`${p.slug}-detail`} className="border-b border-zinc-800">
                        <td colSpan={5} className="bg-zinc-800/30 px-6 py-5">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                              <p className="mb-2 text-xs font-semibold text-zinc-500">Devices</p>
                              <p className="text-sm text-zinc-300">Mobile: {profileStats.deviceSplit.mobile}</p>
                              <p className="text-sm text-zinc-300">Desktop: {profileStats.deviceSplit.desktop}</p>
                              <p className="text-sm text-zinc-300">Tablet: {profileStats.deviceSplit.tablet}</p>
                            </div>
                            <div>
                              <p className="mb-2 text-xs font-semibold text-zinc-500">Top referrers</p>
                              {profileStats.topReferrers.map((r) => (
                                <p key={r.domain} className="text-sm text-zinc-300">
                                  {r.domain || "Direct"}: {r.count}
                                </p>
                              ))}
                              {profileStats.topReferrers.length === 0 && (
                                <p className="text-sm text-zinc-600">None</p>
                              )}
                            </div>
                            <div>
                              <p className="mb-2 text-xs font-semibold text-zinc-500">Top countries</p>
                              {profileStats.topCountries.map((c) => (
                                <p key={c.code} className="text-sm text-zinc-300">
                                  {c.code}: {c.count}
                                </p>
                              ))}
                              {profileStats.topCountries.length === 0 && (
                                <p className="text-sm text-zinc-600">None</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth("admin", async () => {
  const siteStats = await getSiteAnalytics();
  return { props: { siteStats } };
});
