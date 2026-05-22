export const LOGIN_TIPS = [
  "Every run you log trains Kura's endurance.",
  "Kura can rest up to 3 days without getting rusty.",
  "Endurance shows how far Kura can run in one race.",
  "Peak endurance is 42 km, a full marathon for Kura.",
  "Log at least 1 km per run to help Kura improve.",
  "Stay inactive too long and Kura may lose endurance.",
  "Reach certain Endurance and Kura will have new friends",
  "Unlock training partners as Kura's endurance grows.",
  "Somewhere beyond the village, AR. Nab is still training.",
  "The farther Kura runs, the better chance he has to win.",
  "Kura can only log one run per day. Train wisely.",
  "Your real-life runs prepare Kura for his hero moment.",
  "Consistency matters more than a single giant run.",
  "Help Kura grow stronger. Challenge the impossible together.",
  "The lore sections evolve as Kura's endurance grows.",
] as const;

export function pickRandomLoginTip(exclude?: string): string {

  const pool = exclude
    ? LOGIN_TIPS.filter((tip) => tip !== exclude)
    : [...LOGIN_TIPS];

  const candidates = pool.length > 0 ? pool : [...LOGIN_TIPS];
  return candidates[Math.floor(Math.random() * candidates.length)];
}
