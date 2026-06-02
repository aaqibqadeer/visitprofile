import type { Section } from "@/data/types";
import { SocialSection } from "./social-section";
import { LinksSection } from "./links-section";
import { InfoSection } from "./info-section";
import { GallerySection } from "./gallery-section";
import { FormSection } from "./form-section";

/** Renders any structured sheet `Section`. Add a branch to support new types. */
export function SectionView({ section }: { section: Section }) {
  switch (section.type) {
    case "social":
      return <SocialSection section={section} />;
    case "links":
      return <LinksSection section={section} />;
    case "info":
      return <InfoSection section={section} />;
    case "gallery":
      return <GallerySection section={section} />;
    case "form":
      return <FormSection section={section} />;
  }
}
