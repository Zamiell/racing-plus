import { anyPlayerIs, getCollectibles } from "isaacscript-common";
import g from "../../globals";
import { RaceGoal } from "./types/RaceGoal";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";
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
