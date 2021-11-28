import {
  getEffectiveStage,
  getRepentanceDoor,
  removeAllMatchingEntities,
} from "isaacscript-common";
import g from "../../globals";
import { RaceFormat } from "./types/RaceFormat";
import { RaceGoal } from "./types/RaceGoal";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

// MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  checkRemoveRepentanceDoor();
}

// MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  checkRemoveRepentanceDoor();
}

function checkRemoveRepentanceDoor() {
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (
    !roomClear ||
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    roomType !== RoomType.ROOM_BOSS
  ) {
    return;
  }

  if (
    shouldRemoveRepentanceDoorOnSeededRace() ||
    shouldRemoveRepentanceDoorOnBeastRace()
  ) {
    removeRepentanceDoor();
  }
}

// For seeded races, we remove all Repentance doors to mitigate seed divergence
// (the exception is for races to Mother, since in that case, the Repentance path is forced)
// (another exception is for races with a custom goal, since that goal could be in the Repentance
// floors)
function shouldRemoveRepentanceDoorOnSeededRace() {
  return (
    g.race.format === RaceFormat.SEEDED &&
    g.race.goal !== RaceGoal.MOTHER &&
    g.race.goal !== RaceGoal.CUSTOM
  );
}

// For races to The Beast, the player must go to Depths 2
// Thus, we must prevent them from going to the Mausoleum floors by deleting the doors
function shouldRemoveRepentanceDoorOnBeastRace() {
  return g.race.goal === RaceGoal.THE_BEAST && getEffectiveStage() === 5;
}

function removeRepentanceDoor() {
  removeAllMatchingEntities(EntityType.ENTITY_EFFECT, EffectVariant.DUST_CLOUD);

  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor !== undefined) {
    g.r.RemoveDoor(repentanceDoor.Slot);
  }
}
