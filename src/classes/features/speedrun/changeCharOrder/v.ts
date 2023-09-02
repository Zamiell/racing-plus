import type { Challenge, PlayerType } from "isaac-typescript-definitions";
import { ChangeCharOrderPhase } from "../../../../enums/ChangeCharOrderPhase";
import type { SeasonDescription } from "../../../../interfaces/SeasonDescription";
import type { ChallengeCustomAbbreviation } from "../../../../speedrun/constants";
import { CHALLENGE_DEFINITIONS } from "../../../../speedrun/constants";
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

export function getCharacterOrder(): PlayerType[] | undefined {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    return undefined;
  }

  const { challengeCustomAbbreviation, numElements } = challengeDefinition;
  const characterOrder = v.persistent.charOrders.get(
    challengeCustomAbbreviation,
  );
  if (characterOrder === undefined) {
    return undefined;
  }

  if (type(characterOrder) !== "table") {
    return undefined;
  }

  if (characterOrder.length !== numElements) {
    return undefined;
  }

  return characterOrder;
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

export function hasValidCharacterOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    return false;
  }

  const { challengeCustomAbbreviation, numElements } = challengeDefinition;
  if (numElements === 0) {
    // Some seasons do not have any pre-defined choices.
    return true;
  }

  const characterOrder = v.persistent.charOrders.get(
    challengeCustomAbbreviation,
  );
  if (characterOrder === undefined) {
    return false;
  }

  if (type(characterOrder) !== "table") {
    return false;
  }

  return characterOrder.length === numElements;
}

export function speedrunGetFirstChosenCharacter(): PlayerType | undefined {
  const characterOrder = getCharacterOrder();
  if (characterOrder === undefined) {
    return undefined;
  }

  return characterOrder[0];
}
