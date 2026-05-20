import { supabase } from "./supabaseClient";

export interface Badge {
  id: string;
  name: string;
  lore: string;
  image_src: string;
  earned_at?: string;
}

/**
 * Fetch all badges earned by a specific user.
 * We query the profile_badges junction table and join the badges metadata table.
 */
export async function fetchUserBadges(userId: string): Promise<Badge[]> {
  try {
    const { data, error } = await supabase
      .from("profile_badges")
      .select(`
        earned_at,
        badges (
          id,
          name,
          lore,
          image_src
        )
      `)
      .eq("profile_id", userId);

    if (error) {
      console.error("Error fetching user badges:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    if (!data) return [];

    // Map joined relation cleanly into a single Badge object array
    return data
      .map((item: any): Badge | null => {
        if (!item.badges) return null;
        return {
          id: item.badges.id,
          name: item.badges.name,
          lore: item.badges.lore,
          image_src: item.badges.image_src,
          earned_at: item.earned_at,
        };
      })
      .filter((b): b is Badge => b !== null);
  } catch (err) {
    console.error("Error in fetchUserBadges utility:", err);
    return [];
  }
}

/**
 * Awards a specific badge to a user.
 * Gracefully handles the PostgreSQL unique violation (code 23505) in case the badge was already earned.
 */
export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profile_badges")
      .insert({
        profile_id: userId,
        badge_id: badgeId,
      });

    if (error) {
      // 23505 is the Postgres error code for unique constraint violation (already earned)
      if (error.code === "23505") {
        return true;
      }
      console.error(`Failed to award badge ${badgeId} to user ${userId}:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in awardBadge utility:", err);
    return false;
  }
}

/**
 * Revokes a specific badge from a user (e.g. when endurance drops below milestone).
 */
export async function revokeBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profile_badges")
      .delete()
      .eq("profile_id", userId)
      .eq("badge_id", badgeId);

    if (error) {
      console.error(`Failed to revoke badge ${badgeId} from user ${userId}:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in revokeBadge utility:", err);
    return false;
  }
}

/**
 * Syncs the user's badges with their current live endurance.
 * Dynamically awards badges if eligible, and revokes them if they no longer qualify.
 * Returns the fresh, updated array of earned badges.
 */
export async function syncUserBadges(
  userId: string,
  enduranceKm: number,
  currentlyEarned: Badge[]
): Promise<Badge[]> {
  let hasChanged = false;

  const alreadyHasPioneer = currentlyEarned.some((b) => b.id === "prealpha_pioneer");

  if (enduranceKm >= 5.0 && !alreadyHasPioneer) {
    const success = await awardBadge(userId, "prealpha_pioneer");
    if (success) hasChanged = true;
  } else if (enduranceKm < 5.0 && alreadyHasPioneer) {
    const success = await revokeBadge(userId, "prealpha_pioneer");
    if (success) hasChanged = true;
  }

  // Only query the DB for a new list if we actually mutated the state
  if (hasChanged) {
    return fetchUserBadges(userId);
  }

  return currentlyEarned;
}
