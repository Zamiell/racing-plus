import { RoomType } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import v from "../v";

export function season3PreSpawnClearAward(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  checkResetTimeAssigned();
}

/** Reset the starting character timer if we just killed the Basement 2 boss. */
function checkResetTimeAssigned() {
  const roomType = g.r.GetType();
  const effectiveStage = getEffectiveStage();

  if (effectiveStage === 2 && roomType === RoomType.BOSS) {
    v.persistent.timeAssigned = 0;
  }
}
