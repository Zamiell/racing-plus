import { saveDataManager } from "isaacscript-common";
import { CHANGE_CHAR_ORDER_POSITIONS } from "./constants";
import ChangeCharOrderPhase from "./types/ChangeCharOrderPhase";

const v = {
  persistent: {
    /** Indexed by speedrun abbreviation. */
    charOrders: new Map<string, int[]>(),
  },

  room: {
    phase: ChangeCharOrderPhase.SeasonSelect,
    seasonChosenAbbreviation: null as
      | keyof typeof CHANGE_CHAR_ORDER_POSITIONS
      | null,
    createButtonsFrame: null as int | null,
    charOrder: [] as PlayerType[],
    // itemOrder: [] as CollectibleType[],
    sprites: {
      seasons: new Map<string, Sprite>(),
      characters: [] as Sprite[],
      items: [] as Sprite[],
    },
  },
};

export default v;

export function init(): void {
  // We must initialize the table with default values or else the merge script will not copy over
  // old persistent data
  for (const seasonAbbreviation of Object.keys(CHANGE_CHAR_ORDER_POSITIONS)) {
    v.persistent.charOrders.set(seasonAbbreviation, []);
  }

  saveDataManager("changeCharOrder", v);
}

export function getCharacterOrder(key: string): int[] | undefined {
  return v.persistent.charOrders.get(key);
}
