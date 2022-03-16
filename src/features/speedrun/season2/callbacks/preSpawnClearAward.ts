import { getEffectiveStage } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import v from "../v";

export function season2PreSpawnClearAward(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  checkResetTimeAssigned();
}

/** Reset the starting character/build timer if we just killed the Basement 2 boss. */
function checkResetTimeAssigned() {
  const roomType = g.r.GetType();
  const effectiveStage = getEffectiveStage();

  if (effectiveStage === 2 && roomType === RoomType.ROOM_BOSS) {
    v.persistent.timeAssigned = 0;
  }
}
