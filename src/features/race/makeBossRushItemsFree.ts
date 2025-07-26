import {
  PickupPrice,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import { anyPlayerIs, getCollectibles, inRoomType } from "isaacscript-common";
import { inRaceToBossRush, v } from "./v";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!anyPlayerIs(PlayerType.KEEPER_B)) {
    return;
  }

  if (
    !v.run.madeBossRushItemsFree
    && inRaceToBossRush()
    && inRoomType(RoomType.BOSS_RUSH)
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
