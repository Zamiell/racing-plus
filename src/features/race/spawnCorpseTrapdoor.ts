// If the goal of the race is Mother, we need to explicitly spawn a trapdoor after Mom's Heart is
// defeated (because it was manually removed earlier to avoid the player taking the wrong path)

import { spawnGridEntityWithVariant } from "isaacscript-common";
import g from "../../globals";
import { RaceGoal } from "./types/RaceGoal";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";
import v from "./v";

export const NORMAL_TRAPDOOR_POSITION = Vector(320, 200); // Near the top door

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const roomType = g.r.GetType();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED,
  );

  if (
    !v.run.spawnedCorpseTrapdoor &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.MOTHER &&
    mausoleumHeartKilled &&
    roomType === RoomType.ROOM_BOSS
  ) {
    v.run.spawnedCorpseTrapdoor = true;
    const gridIndex = g.r.GetGridIndex(NORMAL_TRAPDOOR_POSITION);
    spawnGridEntityWithVariant(
      GridEntityType.GRID_TRAPDOOR,
      TrapdoorVariant.NORMAL,
      gridIndex,
    );
  }
}
