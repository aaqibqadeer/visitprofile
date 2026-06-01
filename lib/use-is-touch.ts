import { useEffect, useState } from "react";

/**
 * True on touch-first devices (coarse pointer, no hover). Starts `false` so SSR
 * and the first client render agree, then updates after mount.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isTouch;
}
