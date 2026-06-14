import Image from "next/image";
import type { Section } from "@/data/types";

type StorySec = Extract<Section, { type: "story" }>;

/**
 * Storytelling-style "About me" view rendered inside a sheet.
 *
 * Layout: optional hero image → title + subtitle → rich content blocks.
 * Reusable — any profile can open this by setting a section of type "story".
 * Add StoryBlock variants in data/types.ts to extend the content palette.
 */
export function StorySection({ section }: { section: StorySec }) {
  return (
    <article className="space-y-0">
      {/* ── Hero image ─────────────────────────────────────────── */}
      {section.heroImage && (
        <div className="-mx-6 -mt-1 mb-5 overflow-hidden">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={section.heroImage.src}
              alt={section.heroImage.alt}
              fill
              unoptimized
              sizes="440px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Title block ────────────────────────────────────────── */}
      <div className="mb-6 space-y-1">
        <h2 className="font-serif text-3xl leading-tight text-ink">{section.title}</h2>
        {section.subtitle && <p className="text-sm text-ink-soft">{section.subtitle}</p>}
      </div>

      {/* ── Content blocks ─────────────────────────────────────── */}
      <div className="space-y-5">
        {section.blocks.map((block, i) => {
          switch (block.kind) {
            case "heading":
              return (
                <h3 key={i} className="font-serif text-xl text-ink">
                  {block.text}
                </h3>
              );

            case "subheading":
              return (
                <h4
                  key={i}
                  className="text-[13px] font-semibold tracking-widest text-ink-soft uppercase"
                >
                  {block.text}
                </h4>
              );

            case "paragraph":
              return (
                <p key={i} className="text-[15px] leading-7 text-ink-soft">
                  {block.text}
                </p>
              );

            case "image":
              return (
                <figure key={i} className="-mx-6 space-y-2">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={block.src}
                      alt={block.alt}
                      fill
                      unoptimized
                      sizes="440px"
                      className="object-cover"
                    />
                  </div>
                  {block.caption && (
                    <figcaption className="px-6 text-center text-xs text-ink-faint italic">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );

            case "quote":
              return (
                <blockquote key={i} className="border-l-2 border-accent py-1 pl-4">
                  <p className="font-serif text-lg leading-snug text-ink italic">
                    &ldquo;{block.text}&rdquo;
                  </p>
                  {block.by && (
                    <footer className="mt-2 text-xs text-ink-faint">— {block.by}</footer>
                  )}
                </blockquote>
              );

            case "divider":
              return (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-paper-line" />
                  <span className="text-[10px] tracking-[0.3em] text-ink-faint uppercase">✦</span>
                  <div className="h-px flex-1 bg-paper-line" />
                </div>
              );
          }
        })}
      </div>
    </article>
  );
}
