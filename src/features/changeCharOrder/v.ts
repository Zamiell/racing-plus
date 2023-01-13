import { Challenge, PlayerType } from "isaac-typescript-definitions";
import { ChangeCharOrderPhase } from "../../enums/ChangeCharOrderPhase";
import { mod } from "../../mod";
import { SeasonDescription } from "../../types/SeasonDescription";
import { ChallengeCustomAbbreviation } from "../speedrun/constants";
import { CHANGE_CHAR_ORDER_POSITIONS } from "./constants";

export const v = {
  persistent: {
    charOrders: new Map<ChallengeCustomAbbreviation, PlayerType[]>(),
  },

  room: {
    phase: ChangeCharOrderPhase.SEASON_SELECT,
    challengeCustomAbbreviation: null as ChallengeCustomAbbreviation | null,
    createButtonsFrame: null as int | null,
    charOrder: [] as PlayerType[],
    buildsChosen: [] as int[],
    sprites: {
      seasons: new Map<ChallengeCustomAbbreviation, Sprite>(),
      characters: [] as Sprite[],
      items: [] as Sprite[],
    },

    // For fading out after the user has finished picking.
    challengeTarget: null as Challenge | null,
    resetRenderFrame: null as int | null,
  },
};

export function init(): void {
  // We must initialize the table with default values or else the merge script will not copy over
  // old persistent data.
  for (const key of Object.keys(CHANGE_CHAR_ORDER_POSITIONS)) {
    const challengeCustomAbbreviation = key as ChallengeCustomAbbreviation;
    v.persistent.charOrders.set(
      challengeCustomAbbreviation,
      [] as PlayerType[],
    );
  }

  mod.saveDataManager("changeCharOrder", v);
}

export function getCharacterOrder(
  challengeCustomAbbreviation: ChallengeCustomAbbreviation,
): PlayerType[] | undefined {
  return v.persistent.charOrders.get(challengeCustomAbbreviation);
}

export function getSeasonDescription(): SeasonDescription {
  if (v.room.challengeCustomAbbreviation === null) {
    error("seasonChosenAbbreviation is null.");
  }

  const seasonDescription = CHANGE_CHAR_ORDER_POSITIONS.get(
    v.room.challengeCustomAbbreviation,
  );
  if (seasonDescription === undefined) {
    error(
      `Failed to get the season description for: ${v.room.challengeCustomAbbreviation}`,
    );
  }

  return seasonDescription;
}
