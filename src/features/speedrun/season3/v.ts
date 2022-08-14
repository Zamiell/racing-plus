import { PlayerType } from "isaac-typescript-definitions";
import { saveDataManager } from "isaacscript-common";
import { speedrunGetCharacterNum } from "../exported";

const v = {
  persistent: {
    selectedCharacters: [] as PlayerType[],
    remainingCharacters: [] as PlayerType[],
    /** Never start the same character twice in a row. */
    lastSelectedCharacter: null as PlayerType | null,

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
