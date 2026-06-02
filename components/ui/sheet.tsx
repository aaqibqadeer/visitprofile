import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

/**
 * A bottom sheet used for all in-app navigation and reveals. Kept identical on
 * mobile and desktop for now (it sits inside the centred card column on wide
 * screens). Animated with Framer Motion; dismiss via overlay, ✕, Esc, or drag.
 */
export function Sheet({ open, onClose, title, description, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-[85%] w-full flex-col rounded-t-3xl bg-paper-soft px-6 pb-8 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.25)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-paper-line" />
            {title && (
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-ink">{title}</h2>
                  {description && (
                    <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-paper text-ink-soft transition-colors hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
            <div className="-mx-1 flex-1 overflow-y-auto px-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
