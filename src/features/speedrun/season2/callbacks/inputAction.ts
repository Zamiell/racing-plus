import { ChallengeCustom } from "../../enums";
import { SEASON_2_DEBUG } from "../constants";

// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.ACTION_CONSOLE (28)
export function season2IsActionTriggeredConsole(): boolean | void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return undefined;
  }

  if (SEASON_2_DEBUG) {
    return undefined;
  }

  return false;
}
