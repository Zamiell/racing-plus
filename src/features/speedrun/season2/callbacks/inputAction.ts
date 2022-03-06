import g from "../../../../globals";
import { ChallengeCustom } from "../../../../types/ChallengeCustom";

// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.ACTION_CONSOLE (28)
export function season2IsActionTriggeredConsole(): boolean | void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return undefined;
  }

  if (g.debug) {
    return undefined;
  }

  return false;
}
