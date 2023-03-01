import { Challenge, PlayerType } from "isaac-typescript-definitions";
import { ChangeCharOrderPhase } from "../../../../enums/ChangeCharOrderPhase";
import { ChallengeCustomAbbreviation } from "../../../../features/speedrun/constants";
import { SeasonDescription } from "../../../../types/SeasonDescription";
import { CHANGE_CHAR_ORDER_POSITIONS_MAP } from "./constants";

// This is registered in "ChangeCharOrder.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  persistent: {
    charOrders: getBlankCharOrders(),
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

/**
 * We must initialize the persistent data with default values or else the save data merge will not
 * copy over old persistent data.
 */
function getBlankCharOrders(): Map<ChallengeCustomAbbreviation, PlayerType[]> {
  const charOrders = new Map<ChallengeCustomAbbreviation, PlayerType[]>();

  for (const challengeCustomAbbreviation of CHANGE_CHAR_ORDER_POSITIONS_MAP.keys()) {
    charOrders.set(challengeCustomAbbreviation, [] as PlayerType[]);
  }

  return charOrders;
}

export function getCharacterOrder(
  challengeCustomAbbreviation: ChallengeCustomAbbreviation,
): PlayerType[] | undefined {
  return v.persistent.charOrders.get(challengeCustomAbbreviation);
}

export function getSeasonDescription(): SeasonDescription {
  if (v.room.challengeCustomAbbreviation === null) {
    error("challengeCustomAbbreviation is null.");
  }

  const seasonDescription = CHANGE_CHAR_ORDER_POSITIONS_MAP.get(
    v.room.challengeCustomAbbreviation,
  );
  if (seasonDescription === undefined) {
    error(
      `Failed to get the season description for: ${v.room.challengeCustomAbbreviation}`,
    );
  }

  return seasonDescription;
}
