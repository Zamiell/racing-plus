import { anyPlayerIs, getCollectibles } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import v from "./v";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!anyPlayerIs(PlayerType.PLAYER_KEEPER_B)) {
    return;
  }

  const roomType = g.r.GetType();

  if (
    !v.run.madeBossRushItemsFree &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    roomType === RoomType.ROOM_BOSSRUSH
  ) {
    v.run.madeBossRushItemsFree = true;
    makeBossRushItemsFree();
  }
}

function makeBossRushItemsFree() {
  for (const collectible of getCollectibles()) {
    collectible.AutoUpdatePrice = false;
    collectible.Price = PickupPrice.PRICE_FREE;
  }
}
