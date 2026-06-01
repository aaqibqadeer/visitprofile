/** The "M·O" mark in the top-left of the hero. */
export function Monogram({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-white">
      <span className="size-1.5 rounded-full bg-white/90" />
      <span className="font-serif text-lg tracking-wide">{text}</span>
    </div>
  );
}
