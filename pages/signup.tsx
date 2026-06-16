import Head from "next/head";
import { useState, useRef, type FormEvent } from "react";
import { Upload } from "lucide-react";

type State = "form" | "submitting" | "success" | "error";

export default function SignupPage() {
  const [state, setState] = useState<State>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name_first: "",
    name_last: "",
    email: "",
    phone: "",
    company: "",
    role_title: "",
    tagline: "",
    location: "",
    photo_src: "",
    photo_alt: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    if (k === "photo_src") setPhotoPreview(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    setPhotoPreview(URL.createObjectURL(file));

    // Upload file
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json() as { url: string };
      setForm(prev => ({
        ...prev,
        photo_src: url,
        photo_alt: prev.photo_alt || `${prev.name_first} ${prev.name_last}`.trim(),
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setState("success");
    } else {
      const { error } = await res.json() as { error: string };
      setErrorMsg(error ?? "Something went wrong");
      setState("error");
    }
  };

  const inputCls =
    "h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const labelCls = "mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500";

  if (state === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 text-center">
        <div className="max-w-sm">
          <div className="mb-4 text-5xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900">Request submitted!</h1>
          <p className="text-sm text-zinc-500">
            Your profile request has been sent for review. Once approved, you'll receive login credentials to access and customise your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Request access · VisitProfile</title>
      </Head>
      <div className="min-h-screen bg-zinc-100 px-4 py-12">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-1 text-2xl font-bold text-zinc-900">Request your profile</h1>
          <p className="mb-8 text-sm text-zinc-500">
            Fill in your details below. Once approved, you'll get a link to your live digital business card and login credentials to edit it anytime.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {state === "error" && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</p>
            )}

            {/* Required */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Required</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First name *</label>
                  <input className={inputCls} required value={form.name_first} onChange={set("name_first")} placeholder="Jane" />
                </div>
                <div>
                  <label className={labelCls}>Last name *</label>
                  <input className={inputCls} required value={form.name_last} onChange={set("name_last")} placeholder="Smith" />
                </div>
              </div>
              <div className="mt-3">
                <label className={labelCls}>Email *</label>
                <input className={inputCls} type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
              <div className="mt-3">
                <label className={labelCls}>Phone *</label>
                <input className={inputCls} type="tel" required value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
              </div>
            </div>

            {/* Optional */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Optional</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Company</label>
                    <input className={inputCls} value={form.company} onChange={set("company")} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className={labelCls}>Job title</label>
                    <input className={inputCls} value={form.role_title} onChange={set("role_title")} placeholder="Designer" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Tagline</label>
                  <input className={inputCls} value={form.tagline} onChange={set("tagline")} placeholder="One sentence about you" />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input className={inputCls} value={form.location} onChange={set("location")} placeholder="New York, NY" />
                </div>

                {/* Photo */}
                <div>
                  <label className={labelCls}>Photo</label>
                  <div className="space-y-2">
                    <input
                      className={inputCls}
                      value={form.photo_src}
                      onChange={set("photo_src")}
                      placeholder="Paste a photo URL…"
                    />
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="h-px flex-1 bg-zinc-100" /> or <div className="h-px flex-1 bg-zinc-100" />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 py-3 text-sm text-zinc-500 hover:border-indigo-400 hover:text-indigo-600"
                    >
                      <Upload className="size-4" /> Upload a photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    {photoPreview && (
                      <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={state === "submitting"}
              className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {state === "submitting" ? "Submitting…" : "Submit request"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-indigo-600 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}
