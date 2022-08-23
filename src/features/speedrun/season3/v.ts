import { PlayerType } from "isaac-typescript-definitions";
import { saveDataManager } from "isaacscript-common";
import { speedrunGetCharacterNum } from "../exported";
import { Season3Goal } from "./constants";

const v = {
  persistent: {
    selectedCharacters: [] as PlayerType[],
    remainingCharacters: [] as PlayerType[],
    /** Never start the same character twice in a row. */
    lastSelectedCharacter: null as PlayerType | null,

    remainingGoals: [] as Season3Goal[],

    /**
     * The time that the randomly selected character was assigned. This is set to 0 when the
     * Basement 2 boss is defeated.
     */
    timeAssigned: null as int | null,
  },

  run: {
    errors: {
      gameRecentlyOpened: false,
      consoleRecentlyUsed: false,
    },

    /** Used to display the remaining goals during the fade out. */
    goalCompleted: false,

    killedDogma: false,
  },

  room: {
    megaSatanTeleporterSpawned: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("season3", v);
}

export function season3GetCurrentCharacter(): PlayerType | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedCharacters[characterNum - 1];
}

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

export function season3HasDogmaGoal(): boolean {
  return v.persistent.remainingGoals.includes(Season3Goal.DOGMA);
}

export function season3HasOnlyDogmaLeft(): boolean {
  return (
    v.persistent.remainingGoals.includes(Season3Goal.DOGMA) &&
    v.persistent.remainingGoals.length === 1
  );
}
