import g from "../../../../globals";
import { ChallengeCustom } from "../../enums";
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
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (stage === 2 && roomType === RoomType.ROOM_BOSS) {
    v.persistent.timeAssigned = 0;
  }
}
