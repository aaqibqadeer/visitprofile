import type { Section } from "@/data/types";
import { LinkRow } from "@/components/profile/link-row";

type LinksSec = Extract<Section, { type: "links" }>;

/** A stacked list of dynamic-title links inside a sheet. */
export function LinksSection({ section }: { section: LinksSec }) {
  return (
    <div className="space-y-2">
      {section.items.map((item) => (
        <LinkRow key={item.label} item={item} />
      ))}
    </div>
  );
}
