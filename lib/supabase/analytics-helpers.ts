import { createAdminClient } from "./server";

export type ProfileStats = {
  totalViews: number;
  uniqueSessions: number;
  viewsByDay: { date: string; count: number }[];
  topReferrers: { domain: string; count: number }[];
  deviceSplit: { mobile: number; tablet: number; desktop: number };
  topCountries: { code: string; count: number }[];
  topLinks: { label: string; kind: string; count: number }[];
};

export type SiteStats = {
  totalViews: number;
  totalProfiles: number;
  viewsByDay: { date: string; count: number }[];
  profileSummary: { slug: string; total_views: number; unique_sessions: number; last_viewed: string | null }[];
};

export async function recordView(data: {
  slug: string;
  referrer?: string;
  device_type?: string;
  country_code?: string;
  session_id?: string;
}): Promise<void> {
  const admin = createAdminClient();
  await admin.from("profile_views").insert(data);
}

export async function recordClick(data: {
  slug: string;
  link_label: string;
  link_kind: string;
  session_id?: string;
}): Promise<void> {
  const admin = createAdminClient();
  await admin.from("profile_link_clicks").insert(data);
}

export async function getProfileAnalytics(slug: string): Promise<ProfileStats> {
  const admin = createAdminClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [viewsRes, clicksRes] = await Promise.all([
    admin
      .from("profile_views")
      .select("viewed_at, referrer, device_type, country_code, session_id")
      .eq("slug", slug)
      .gte("viewed_at", thirtyDaysAgo),
    admin
      .from("profile_link_clicks")
      .select("link_label, link_kind")
      .eq("slug", slug)
      .gte("clicked_at", thirtyDaysAgo),
  ]);

  const views = viewsRes.data ?? [];
  const clicks = clicksRes.data ?? [];

  // Total counts
  const totalViews = views.length;
  const uniqueSessions = new Set(views.map((v) => v.session_id).filter(Boolean)).size;

  // Views by day (last 30 days)
  const dayMap: Record<string, number> = {};
  for (const v of views) {
    const date = v.viewed_at.slice(0, 10);
    dayMap[date] = (dayMap[date] ?? 0) + 1;
  }
  const viewsByDay = Object.entries(dayMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top referrers
  const refMap: Record<string, number> = {};
  for (const v of views) {
    if (v.referrer) refMap[v.referrer] = (refMap[v.referrer] ?? 0) + 1;
  }
  const topReferrers = Object.entries(refMap)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Device split
  const deviceSplit = { mobile: 0, tablet: 0, desktop: 0 };
  for (const v of views) {
    const d = (v.device_type ?? "desktop") as keyof typeof deviceSplit;
    if (d in deviceSplit) deviceSplit[d]++;
  }

  // Top countries
  const countryMap: Record<string, number> = {};
  for (const v of views) {
    if (v.country_code) countryMap[v.country_code] = (countryMap[v.country_code] ?? 0) + 1;
  }
  const topCountries = Object.entries(countryMap)
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top clicked links
  const linkMap: Record<string, { kind: string; count: number }> = {};
  for (const c of clicks) {
    const key = `${c.link_label}::${c.link_kind}`;
    if (!linkMap[key]) linkMap[key] = { kind: c.link_kind, count: 0 };
    linkMap[key].count++;
  }
  const topLinks = Object.entries(linkMap)
    .map(([key, { kind, count }]) => ({ label: key.split("::")[0], kind, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { totalViews, uniqueSessions, viewsByDay, topReferrers, deviceSplit, topCountries, topLinks };
}

export async function getSiteAnalytics(): Promise<SiteStats> {
  const admin = createAdminClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [viewsRes, profilesRes] = await Promise.all([
    admin
      .from("profile_views")
      .select("viewed_at, slug, session_id")
      .gte("viewed_at", thirtyDaysAgo),
    admin.from("profiles").select("slug").eq("status", "approved"),
  ]);

  const views = viewsRes.data ?? [];
  const profiles = profilesRes.data ?? [];

  const totalViews = views.length;
  const totalProfiles = profiles.length;

  const dayMap: Record<string, number> = {};
  const slugStats: Record<string, { total_views: number; sessions: Set<string>; last_viewed: string | null }> = {};

  for (const v of views) {
    const date = v.viewed_at.slice(0, 10);
    dayMap[date] = (dayMap[date] ?? 0) + 1;

    if (!slugStats[v.slug]) slugStats[v.slug] = { total_views: 0, sessions: new Set(), last_viewed: null };
    slugStats[v.slug].total_views++;
    if (v.session_id) slugStats[v.slug].sessions.add(v.session_id);
    if (!slugStats[v.slug].last_viewed || v.viewed_at > slugStats[v.slug].last_viewed!) {
      slugStats[v.slug].last_viewed = v.viewed_at;
    }
  }

  const viewsByDay = Object.entries(dayMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const profileSummary = Object.entries(slugStats)
    .map(([slug, s]) => ({
      slug,
      total_views: s.total_views,
      unique_sessions: s.sessions.size,
      last_viewed: s.last_viewed,
    }))
    .sort((a, b) => b.total_views - a.total_views);

  return { totalViews, totalProfiles, viewsByDay, profileSummary };
}
