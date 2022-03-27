// If the goal of the race is Mother, we need to explicitly spawn a trapdoor after Mom's Heart is
// defeated (because it was manually removed earlier to avoid the player taking the wrong path)

import { spawnGridWithVariant } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import v from "./v";

const NORMAL_TRAPDOOR_POSITION = Vector(320, 200); // Near the top door

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
    spawnGridWithVariant(
      GridEntityType.GRID_TRAPDOOR,
      TrapdoorVariant.NORMAL,
      gridIndex,
    );
  }
}
