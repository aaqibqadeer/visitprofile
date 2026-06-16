import type { Badge, BadgeSize } from "@/data/types";

const TEXT_SIZE: Record<BadgeSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  m: "text-lg",
  large: "text-xl",
  xlarge: "text-2xl",
};

const IMG_SIZE: Record<BadgeSize, string> = {
  xs: "h-4",
  sm: "h-5",
  m: "h-7",
  large: "h-9",
  xlarge: "h-12",
};

/** The mark in the top-left of the hero — text or small image, with 5 sizes. */
export function Monogram({ badge }: { badge: Badge }) {
  const size = badge.size ?? "m";
  const { content } = badge;

  return (
    <div className="flex items-center gap-2 text-white">
      <span className="size-1.5 shrink-0 rounded-full bg-white/90" />
      {content.type === "text" ? (
        <span className={`font-serif tracking-wide ${TEXT_SIZE[size]}`}>{content.value}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.src}
          alt={content.alt ?? ""}
          className={`${IMG_SIZE[size]} w-auto object-contain`}
        />
      )}
    </div>
  );
}
