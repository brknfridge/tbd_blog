/**
 * GA4 events for Spendle, sent through the site's existing gtag (G-T4DT9ES451, loaded in index.html).
 * Event names are prefixed `spendle_` so they're easy to find among the site's other events.
 * In dev the event is logged instead of sent, so local play never pollutes the live property.
 */
type Params = Record<string, string | number | boolean>;
type Gtag = (command: "event", name: string, params?: Params) => void;

export const EVENTS = {
  gameStart: "spendle_game_start",
  gameComplete: "spendle_game_complete",
} as const;

export function track(name: string, params: Params = {}): void {
  if (import.meta.env.DEV) {
    console.debug("[ga]", name, params);
    return;
  }
  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("event", name, params);
  } catch {
    /* analytics must never break the game */
  }
}
