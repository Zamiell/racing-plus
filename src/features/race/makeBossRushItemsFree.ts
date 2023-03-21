import {
  PickupPrice,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import { anyPlayerIs, getCollectibles, inRoomType } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";
import { v } from "./v";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!anyPlayerIs(PlayerType.KEEPER_B)) {
    return;
  }

  if (
    !v.run.madeBossRushItemsFree &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    inRoomType(RoomType.BOSS_RUSH)
  ) {
    v.run.madeBossRushItemsFree = true;
    makeBossRushItemsFree();
  }
}

function makeBossRushItemsFree() {
  for (const collectible of getCollectibles()) {
    collectible.AutoUpdatePrice = false;
    collectible.Price = PickupPrice.FREE;
  }
}
