import type { Badge, BadgeSize } from "@/data/types";

const TEXT_SIZE: Record<BadgeSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  m: "text-xs",
  large: "text-sm",
  xlarge: "text-base",
};

const IMG_SIZE: Record<BadgeSize, string> = {
  xs: "h-3",
  sm: "h-4",
  m: "h-5",
  large: "h-6",
  xlarge: "h-8",
};

/** Frosted badge in the top-right of the hero — text or small image, with 5 sizes. */
export function StatusBadge({ badge }: { badge: Badge }) {
  const size = badge.size ?? "m";
  const { content } = badge;

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
      <span className="size-2 shrink-0 rounded-full bg-accent shadow-[0_0_6px] shadow-accent" />
      {content.type === "text" ? (
        <span className={`font-medium tracking-wider text-white uppercase ${TEXT_SIZE[size]}`}>
          {content.value}
        </span>
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
