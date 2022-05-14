import { PlayerType } from "isaac-typescript-definitions";
import { saveDataManager } from "isaacscript-common";
import { speedrunGetCharacterNum } from "../exported";

const v = {
  persistent: {
    selectedCharacters: [] as PlayerType[],
    remainingCharacters: [] as PlayerType[],
    /** Never start the same character twice in a row. */
    lastSelectedCharacter: null as PlayerType | null,

    selectedBuildIndexes: [] as int[],
    remainingBuildIndexes: [] as int[],
    /** Never start the same build twice in a row. */
    lastSelectedBuildIndex: null as int | null,

    /** The time that the bans were set in the "Change Char Order" custom challenge. */
    timeBansSet: null as int | null,

    /**
     * The time that the randomly selected character & build were assigned. This is set to 0 when
     * the Basement 2 boss is defeated.
     */
    timeAssigned: null as int | null,
  },

  run: {
    errors: {
      gameRecentlyOpened: false,
      consoleRecentlyUsed: false,
      bansRecentlySet: false,
    },
  },
};
export default v;

export function init(): void {
  saveDataManager("season2", v);
}

export function season2GetCurrentBuildIndex(): int | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedBuildIndexes[characterNum - 1];
}

export function season2GetCurrentCharacter(): PlayerType | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedCharacters[characterNum - 1];
}

export function season2SetBansTime(): void {
  v.persistent.timeBansSet = Isaac.GetTime();
}
