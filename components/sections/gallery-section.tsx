import Image from "next/image";
import type { Section } from "@/data/types";

type GallerySec = Extract<Section, { type: "gallery" }>;

/** Image grid (portfolio / photo gallery / before-after). */
export function GallerySection({ section }: { section: GallerySec }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {section.images.map((img, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            unoptimized
            sizes="200px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
