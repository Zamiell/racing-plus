// If the goal of the race is Mother, we need to explicitly spawn a trapdoor after Mom's Heart is
// defeated (because it was manually removed earlier to avoid the player taking the wrong path).

import {
  GameStateFlag,
  GridEntityType,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import { game, spawnGridEntityWithVariant } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import v from "./v";

const NORMAL_TRAPDOOR_POSITION = Vector(320, 200); // Near the top door

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const mausoleumHeartKilled = game.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );
  const roomType = g.r.GetType();

  if (
    !v.run.spawnedCorpseTrapdoor &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.MOTHER &&
    mausoleumHeartKilled &&
    roomType === RoomType.BOSS
  ) {
    v.run.spawnedCorpseTrapdoor = true;
    const gridIndex = g.r.GetGridIndex(NORMAL_TRAPDOOR_POSITION);
    spawnGridEntityWithVariant(
      GridEntityType.TRAPDOOR,
      TrapdoorVariant.NORMAL,
      gridIndex,
    );
  }
}
