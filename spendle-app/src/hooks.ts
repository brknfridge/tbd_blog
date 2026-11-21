import { useEffect, useRef, useState } from "react";
import { secondsLeft } from "./lib/timer";

/**
 * Re-renders only when the visible second changes. Checks on an interval and on
 * tab return, so a throttled background tab resolves the moment it's visible.
 */
export function useCountdown(deadline: number | null, onExpire: () => void): number | null {
  const [secs, setSecs] = useState<number | null>(() => (deadline ? secondsLeft(deadline) : null));
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (deadline === null) {
      setSecs(null);
      return;
    }
    let fired = false;
    const tick = () => {
      const s = secondsLeft(deadline);
      setSecs((prev) => (prev === s ? prev : s));
      if (s <= 0 && !fired) {
        fired = true;
        expireRef.current();
      }
    };
    tick();
    const id = window.setInterval(tick, 200);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, [deadline]);

  return secs;
}

/**
 * Tracks the visual viewport so the game screen can shrink above the on-screen
 * keyboard instead of being pushed off it (iOS doesn't resize dvh for keyboards).
 */
export function useVisualViewportHeight(): void {
  useEffect(() => {
    const vv = window.visualViewport;
    const root = document.documentElement;
    const update = () => {
      const h = vv ? vv.height : window.innerHeight;
      root.style.setProperty("--sp-vvh", `${h}px`);
      if (vv && vv.offsetTop > 0) window.scrollTo(0, 0);
    };
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--sp-vvh");
    };
  }, []);
}

export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
