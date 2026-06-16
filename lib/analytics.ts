const SESSION_KEY = "vp_session_id";

function getSessionId(): string {
  if (typeof sessionStorage === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return "mobile";
  return "desktop";
}

function getReferrerDomain(): string {
  try {
    if (!document.referrer) return "";
    return new URL(document.referrer).hostname;
  } catch {
    return "";
  }
}

const viewedSlugs = new Set<string>();

export function trackView(slug: string): void {
  if (viewedSlugs.has(slug)) return;
  viewedSlugs.add(slug);

  void fetch("/api/analytics/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug,
      referrer: getReferrerDomain(),
      device_type: getDeviceType(),
      session_id: getSessionId(),
    }),
  }).catch(() => {});
}

export function trackClick(slug: string, label: string, kind: string): void {
  void fetch("/api/analytics/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug,
      link_label: label,
      link_kind: kind,
      session_id: getSessionId(),
    }),
  }).catch(() => {});
}
