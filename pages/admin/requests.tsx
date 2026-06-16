import Head from "next/head";
import { useState, useEffect } from "react";
import type { GetServerSideProps } from "next";
import { withAuth } from "@/lib/with-auth";
import { Check, X, Copy, ChevronDown } from "lucide-react";
import Link from "next/link";

interface SignupRequest {
  id: string;
  status: string;
  name_first: string;
  name_last: string;
  email: string;
  phone: string;
  company: string | null;
  role_title: string | null;
  tagline: string | null;
  location: string | null;
  photo_src: string | null;
  created_at: string;
}

interface Props {
  user: { id: string; email: string; role: "admin" | "user" };
}

function ApproveModal({
  request,
  onClose,
  onApproved,
}: {
  request: SignupRequest;
  onClose: () => void;
  onApproved: (slug: string, tempPw: string) => void;
}) {
  const [tempPw, setTempPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    if (tempPw.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/admin/requests/${request.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temp_password: tempPw }),
    });
    const data = await res.json() as { ok?: boolean; error?: string; slug?: string; temp_password?: string };
    if (!res.ok) {
      setError(data.error ?? "Failed");
      setLoading(false);
      return;
    }
    onApproved(data.slug!, data.temp_password!);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-1 text-lg font-bold text-zinc-900">Approve {request.name_first} {request.name_last}</h2>
        <p className="mb-4 text-sm text-zinc-500">{request.email}</p>
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
          Temporary password (you'll share this with the user)
        </label>
        <input
          type="text"
          value={tempPw}
          onChange={e => setTempPw(e.target.value)}
          placeholder="Min 8 characters"
          className="mb-4 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Approving…" : "Approve & create account"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({
  name,
  slug,
  tempPw,
  onClose,
}: {
  name: string;
  slug: string;
  tempPw: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(tempPw);
    setCopied(true);
  };
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 text-3xl">✅</div>
        <h2 className="mb-1 text-lg font-bold text-zinc-900">{name} approved!</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Their profile is live at{" "}
          <a href={profileUrl} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">
            {profileUrl}
          </a>
        </p>
        <div className="mb-4 rounded-lg bg-amber-50 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-amber-700">
            Share this temporary password — shown only once
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-white px-3 py-2 text-sm font-mono text-zinc-900 border border-amber-200">
              {tempPw}
            </code>
            <button onClick={copy} className="rounded-lg border border-amber-200 bg-white p-2 hover:bg-amber-50">
              {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4 text-amber-600" />}
            </button>
          </div>
        </div>
        <button onClick={onClose} className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
          Done
        </button>
      </div>
    </div>
  );
}

export default function RequestsPage({ user: _user }: Props) {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ name: string; slug: string; tempPw: string } | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/requests");
    if (res.ok) setRequests(await res.json() as SignupRequest[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reject = async (id: string) => {
    if (!confirm("Reject this request?")) return;
    await fetch(`/api/admin/requests/${id}/reject`, { method: "POST" });
    load();
  };

  const pending = requests.filter(r => r.status === "pending");
  const processed = requests.filter(r => r.status !== "pending");

  const approvingRequest = requests.find(r => r.id === approvingId) ?? null;

  return (
    <>
      <Head><title>Requests · Admin · VisitProfile</title></Head>

      {approvingRequest && (
        <ApproveModal
          request={approvingRequest}
          onClose={() => setApprovingId(null)}
          onApproved={(slug, tempPw) => {
            setApprovingId(null);
            setSuccessData({ name: `${approvingRequest.name_first} ${approvingRequest.name_last}`, slug, tempPw });
            load();
          }}
        />
      )}
      {successData && (
        <SuccessModal {...successData} onClose={() => setSuccessData(null)} />
      )}

      <div className="min-h-screen bg-zinc-100">
        {/* Top bar */}
        <div className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">← Profiles</Link>
              <h1 className="text-lg font-bold text-white">Signup requests</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/analytics" className="text-sm text-zinc-400 hover:text-white">
                Analytics
              </Link>
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
                {pending.length} pending
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
          {loading ? (
            <p className="text-sm text-zinc-400">Loading…</p>
          ) : (
            <>
              {pending.length === 0 && (
                <p className="text-sm text-zinc-400">No pending requests.</p>
              )}
              {pending.length > 0 && (
                <section>
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Pending</h2>
                  <div className="space-y-3">
                    {pending.map(r => (
                      <RequestCard
                        key={r.id}
                        request={r}
                        onApprove={() => setApprovingId(r.id)}
                        onReject={() => reject(r.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
              {processed.length > 0 && (
                <section>
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Processed</h2>
                  <div className="space-y-3">
                    {processed.map(r => (
                      <RequestCard key={r.id} request={r} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function RequestCard({
  request: r,
  onApprove,
  onReject,
}: {
  request: SignupRequest;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPending = r.status === "pending";

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 p-4">
        {r.photo_src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.photo_src} alt={r.name_first} className="size-12 rounded-full object-cover shrink-0" />
        ) : (
          <div className="size-12 shrink-0 rounded-full bg-zinc-200 flex items-center justify-center text-lg font-bold text-zinc-500">
            {r.name_first[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-900 truncate">
            {r.name_first} {r.name_last}
          </p>
          <p className="text-sm text-zinc-500 truncate">{r.email} · {r.phone}</p>
          {(r.company || r.role_title) && (
            <p className="text-xs text-zinc-400 truncate">{[r.role_title, r.company].filter(Boolean).join(" @ ")}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            r.status === "pending" ? "bg-amber-100 text-amber-700"
            : r.status === "approved" ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-600"
          }`}>
            {r.status}
          </span>
          {isPending && onApprove && onReject && (
            <>
              <button onClick={onApprove} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                <Check className="size-3.5" />
              </button>
              <button onClick={onReject} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                <X className="size-3.5" />
              </button>
            </>
          )}
          <button onClick={() => setExpanded(!expanded)} className="text-zinc-400 hover:text-zinc-700">
            <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3 text-sm text-zinc-600 space-y-1">
          {r.location && <p><strong>Location:</strong> {r.location}</p>}
          {r.tagline && <p><strong>Tagline:</strong> {r.tagline}</p>}
          <p className="text-xs text-zinc-400">Submitted {new Date(r.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth("admin", async () => {
  return { props: {} };
});
