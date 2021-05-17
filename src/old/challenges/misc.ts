import { CHALLENGE_DEFINITIONS } from "./constants";

export function inSpeedrun(): boolean {
  const thisChallengeID = Isaac.GetChallenge();
  if (thisChallengeID === 0) {
    return false;
  }

  for (const challengeDefinition of CHALLENGE_DEFINITIONS) {
    const challengeID = challengeDefinition[0];
    if (thisChallengeID === challengeID) {
      return true;
    }
  }

  return false;
}
