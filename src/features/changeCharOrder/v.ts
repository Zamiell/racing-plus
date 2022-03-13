import { saveDataManager } from "isaacscript-common";
import { CHANGE_CHAR_ORDER_POSITIONS } from "./constants";
import { ChangeCharOrderPhase } from "./types/ChangeCharOrderPhase";
import { SeasonDescription } from "./types/SeasonDescription";

const v = {
  persistent: {
    /** Indexed by speedrun abbreviation. */
    charOrders: new Map<string, PlayerType[]>(),
  },

  room: {
    phase: ChangeCharOrderPhase.SEASON_SELECT,
    seasonChosenAbbreviation: null as
      | keyof typeof CHANGE_CHAR_ORDER_POSITIONS
      | null,
    createButtonsFrame: null as int | null,
    charOrder: [] as PlayerType[],
    buildsChosen: [] as int[],
    sprites: {
      /** Indexed by season abbreviation. */
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

export function getCharacterOrder(key: string): PlayerType[] | undefined {
  return v.persistent.charOrders.get(key);
}

export function getSeasonDescription(): SeasonDescription {
  if (v.room.seasonChosenAbbreviation === null) {
    error("seasonChosenAbbreviation is null.");
  }

  const seasonDescription =
    CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];
  if (seasonDescription === undefined) {
    error(
      `Failed to get the season description for: ${v.room.seasonChosenAbbreviation}`,
    );
  }

  return seasonDescription;
}
