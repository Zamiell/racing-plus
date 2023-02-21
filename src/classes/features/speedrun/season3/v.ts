import {
  Season3Goal,
  SEASON_3_GOALS_THROUGH_WOMB_1,
} from "../../../../features/speedrun/season3/constants";

export const v = {
  persistent: {
    remainingGoals: [] as Season3Goal[],
  },

  run: {
    /** Used to display the remaining goals during the fade out. */
    goalCompleted: false,

    /** Used to spawn a second trapdoor after taking a collectible. */
    season3TrapdoorBetweenPhotosSpawned: false,
  },
};

export function season3HasBlueBabyGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.BLUE_BABY);
}

export function season3HasLambGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.THE_LAMB);
}

export function season3HasMegaSatanGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.MEGA_SATAN);
}

export function season3HasOnlyBossRushLeft(): boolean {
  return (
    v.persistent.remainingGoals.includes(Season3Goal.BOSS_RUSH) &&
    v.persistent.remainingGoals.length === 1
  );
}

export function season3HasHushGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.HUSH);
}

export function season3HasOnlyHushLeft(): boolean {
  return (
    v.persistent.remainingGoals.includes(Season3Goal.HUSH) &&
    v.persistent.remainingGoals.length === 1
  );
}

export function season3HasMotherGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.MOTHER);
}

export function season3HasOnlyMotherLeft(): boolean {
  return (
    v.persistent.remainingGoals.includes(Season3Goal.MOTHER) &&
    v.persistent.remainingGoals.length === 1
  );
}

export function season3HasDogmaGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.DOGMA);
}

export function season3HasOnlyDogmaLeft(): boolean {
  return (
    v.persistent.remainingGoals.includes(Season3Goal.DOGMA) &&
    v.persistent.remainingGoals.length === 1
  );
}

export function season3HasGoalThroughWomb1(): boolean {
  return v.persistent.remainingGoals.some((goal) =>
    SEASON_3_GOALS_THROUGH_WOMB_1.has(goal),
  );
}
