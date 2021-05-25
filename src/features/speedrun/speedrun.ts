import g from "../../globals";
import { log } from "../../misc";
import { CHALLENGE_DEFINITIONS } from "./constants";

export function checkValidCharOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    error(
      `Failed to find challenge ${challenge} in the challenge definitions.`,
    );
  }

  const [abbreviation, numElements] = challengeDefinition;
  if (abbreviation === undefined || numElements === undefined) {
    error(
      `Failed to find parse the challenge definition for challenge: ${challenge}`,
    );
  }

  const characterOrder = g.speedrun.characterOrder.get(challenge);
  if (characterOrder === undefined) {
    return false;
  }

  if (type(characterOrder) !== "table") {
    log(
      `Error: The character order for challenge ${challenge} was not a table.`,
    );
    return false;
  }

  if (characterOrder.length !== numElements) {
    log(
      `Error: The character order for challenge ${challenge} had ${characterOrder.length} elements, but it needs to have ${numElements}.`,
    );
    return false;
  }

  return true;
}

export function getCurrentCharacter(): int {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    error(
      `Failed to find challenge ${challenge} in the challenge definitions.`,
    );
  }

  const [abbreviation, numElements] = challengeDefinition;
  if (abbreviation === undefined || numElements === undefined) {
    error(
      `Failed to find parse the challenge definition for challenge: ${challenge}`,
    );
  }

  const characterOrder = g.speedrun.characterOrder.get(challenge);
  if (characterOrder === undefined) {
    return 0;
  }

  if (type(characterOrder) !== "table") {
    log(
      `Error: The character order for challenge ${challenge} was not a table.`,
    );
    return 0;
  }

  if (characterOrder.length !== numElements) {
    log(
      `Error: The character order for challenge ${challenge} had ${characterOrder.length} elements, but it needs to have ${numElements}.`,
    );
    return 0;
  }

  if (g.speedrun.characterNum < 1) {
    log("Error: The character number is less than 1.");
    return 0;
  }

  if (g.speedrun.characterNum > characterOrder.length) {
    log(
      `Error: The character number is greater than ${characterOrder.length} (i.e. the amount of characters in this speedrun).`,
    );
    return 0;
  }

  const arrayIndex = g.speedrun.characterNum - 1;
  const character = characterOrder[arrayIndex];
  if (character === undefined) {
    log(
      `Error: Failed to find the character at array index ${arrayIndex} for the character order of challenge ${challenge}.`,
    );
    return 0;
  }

  return character;
}

export function inSpeedrun(): boolean {
  const challenge = Isaac.GetChallenge();
  return Object.keys(CHALLENGE_DEFINITIONS).includes(challenge.toString());
}
