/**
 * milestones.ts — Kura's Training Partners & Milestone Milestones
 *
 * This system tracks Kura's progress towards matching the pace/stamina of
 * different characters in the world. E.g., when Kura reaches 2km, he can
 * keep up with a Slime.
 */

export interface Milestone {
  id: string;
  name: string;
  requiredEndurance: number; // in km
  description: string;
  imageSrc: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: "slime",
    name: "Slime",
    requiredEndurance: 2.0,
    description: "A tiny, friendly slime near the village river. Kura can now train alongside it.",
    imageSrc: "/training-partner/slime.png",
  },
  {
    id: "village_kid",
    name: "Village Kid",
    requiredEndurance: 3.0,
    description: "A playful kid who loves tag. He can barely keep up with Kura now.",
    imageSrc: "/training-partner/village_kid.png",
  },
  {
    id: "rabbit_scout",
    name: "Rabbit Scout",
    requiredEndurance: 5.0,
    description: "A swift forest scout. Kura can now match his steady pace.",
    imageSrc: "/training-partner/rabbit_scout.png",
  },
  {
    id: "forest_runner",
    name: "Forest Runner",
    requiredEndurance: 8.0,
    description: "A seasoned guardian of the Balak Forest. Kura is finally strong enough to train by their side.",
    imageSrc: "/training-partner/forest_runner.png",
  },
];

/**
 * Gets all milestones that the user has currently unlocked.
 */
export function getUnlockedMilestones(enduranceKm: number): Milestone[] {
  return MILESTONES.filter((m) => enduranceKm >= m.requiredEndurance);
}

/**
 * Gets the next upcoming milestone.
 */
export function getNextMilestone(enduranceKm: number): Milestone | null {
  return MILESTONES.find((m) => m.requiredEndurance > enduranceKm) || null;
}

/**
 * Gets the highest milestone currently unlocked.
 */
export function getCurrentMilestone(enduranceKm: number): Milestone | null {
  const unlocked = getUnlockedMilestones(enduranceKm);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

/**
 * Calculates progress parameters for the next milestone.
 * Returns:
 *  - previousThreshold: the endurance requirement of the current milestone (or 1.0 if none)
 *  - nextThreshold: the endurance requirement of the next milestone
 *  - percentage: 0 to 100 representing progress from previousThreshold to nextThreshold
 */
export interface ProgressData {
  previousThreshold: number;
  nextThreshold: number;
  currentValue: number;
  percentage: number;
}

export function getMilestoneProgress(enduranceKm: number): ProgressData | null {
  const next = getNextMilestone(enduranceKm);
  if (!next) return null;

  const current = getCurrentMilestone(enduranceKm);
  const previousThreshold = current ? current.requiredEndurance : 1.0; // Base start is 1.0km
  const nextThreshold = next.requiredEndurance;

  const totalRange = nextThreshold - previousThreshold;
  const currentOffset = enduranceKm - previousThreshold;
  const percentage = Math.max(0, Math.min(100, Math.round((currentOffset / totalRange) * 100)));

  return {
    previousThreshold,
    nextThreshold,
    currentValue: enduranceKm,
    percentage,
  };
}
