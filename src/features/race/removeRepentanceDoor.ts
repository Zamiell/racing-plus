// For races to The Beast, the player must go to Depths 2
// Thus, we must prevent them from going to the Mausoleum floors by deleting the doors

import {
  getRepentanceDoor,
  onRepentanceStage,
  removeAllEntities,
} from "isaacscript-common";
import g from "../../globals";
import RaceGoal from "./types/RaceGoal";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";

// MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  removeRepentanceDoor();
}

// MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  removeRepentanceDoor();
}

function removeRepentanceDoor() {
  const stage = g.l.GetStage();
  const repentanceStage = onRepentanceStage();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.THE_BEAST ||
    roomType !== RoomType.ROOM_BOSS ||
    ((!repentanceStage || stage !== 4) && (repentanceStage || stage !== 5))
  ) {
    return;
  }

  if (roomClear) {
    const dustClouds = Isaac.FindByType(
      EntityType.ENTITY_EFFECT,
      EffectVariant.DUST_CLOUD,
    );
    removeAllEntities(dustClouds);

    const repentanceDoor = getRepentanceDoor();
    if (repentanceDoor !== null) {
      g.r.RemoveDoor(repentanceDoor.Slot);
    }
  }
}
