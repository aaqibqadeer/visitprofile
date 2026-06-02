import type { Section } from "@/data/types";

type InfoSec = Extract<Section, { type: "info" }>;

/** Long-form content (About, Services, Hours, FAQ-as-prose, etc.). */
export function InfoSection({ section }: { section: InfoSec }) {
  return (
    <div className="space-y-4">
      {section.blocks.map((block, i) => {
        switch (block.kind) {
          case "heading":
            return (
              <h3 key={i} className="font-serif text-lg text-ink">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="text-sm leading-relaxed text-ink-soft">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="space-y-1.5">
                {block.items.map((li, j) => (
                  <li key={j} className="flex gap-2 text-sm text-ink-soft">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            );
          case "stat":
            return (
              <div key={i} className="flex items-baseline justify-between border-b border-paper-line pb-2">
                <span className="text-sm text-ink-soft">{block.label}</span>
                <span className="font-serif text-lg text-ink">{block.value}</span>
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className="rounded-2xl bg-paper-soft p-4">
                <p className="font-serif text-base italic text-ink">“{block.text}”</p>
                {block.by && <footer className="mt-2 text-xs text-ink-faint">— {block.by}</footer>}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
