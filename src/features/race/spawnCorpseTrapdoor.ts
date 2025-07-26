// If the goal of the race is Mother, we need to explicitly spawn a trapdoor after Mom's Heart is
// defeated (because it was manually removed earlier to avoid the player taking the wrong path).

import {
  GameStateFlag,
  GridEntityType,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  game,
  inRoomType,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { inRaceToMother, v } from "./v";

const NORMAL_TRAPDOOR_POSITION = Vector(320, 200); // Near the top door

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const mausoleumHeartKilled = game.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );
  const room = game.GetRoom();

  if (
    !v.run.spawnedCorpseTrapdoor
    && inRaceToMother()
    && mausoleumHeartKilled
    && inRoomType(RoomType.BOSS)
  ) {
    v.run.spawnedCorpseTrapdoor = true;
    const gridIndex = room.GetGridIndex(NORMAL_TRAPDOOR_POSITION);
    spawnGridEntityWithVariant(
      GridEntityType.TRAPDOOR,
      TrapdoorVariant.NORMAL,
      gridIndex,
    );
  }
}
