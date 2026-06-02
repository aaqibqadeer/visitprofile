import { useState } from "react";
import { Check } from "lucide-react";
import type { Section } from "@/data/types";

type FormSec = Extract<Section, { type: "form" }>;

/**
 * Lead-gen form (contact / callback / quote / waitlist). Dummy submit for now —
 * it just shows a confirmation. Wire `onSubmit` to an API when ready.
 */
export function FormSection({ section }: { section: FormSec }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-ink">
          <Check className="size-6" />
        </span>
        <p className="font-serif text-lg text-ink">Thanks — we&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {section.fields.map((field) =>
        field.type === "textarea" ? (
          <textarea
            key={field.name}
            name={field.name}
            required={field.required}
            placeholder={field.label}
            rows={3}
            className="w-full resize-none rounded-2xl bg-paper-soft px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-accent/40"
          />
        ) : (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            placeholder={field.label}
            className="w-full rounded-2xl bg-paper-soft px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-accent/40"
          />
        )
      )}
      <button
        type="submit"
        className="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-surface-ink transition-opacity hover:opacity-90"
      >
        {section.submitLabel ?? "Submit"}
      </button>
    </form>
  );
}
