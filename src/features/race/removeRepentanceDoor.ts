import {
  getEffectiveStage,
  getEffects,
  getRepentanceDoor,
  removeDoor,
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

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
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

/**
 * For seeded races, we remove all Repentance doors to mitigate seed divergence. However, there are
 * some exceptions:
 *
 * - Races to Mother, since in that case, the Repentance path is forced.
 * - Races with a custom goal, since that goal could be in the Repentance floors.
 * - Solo races, since we don't care about seed divergence in this case.
 */
function shouldRemoveRepentanceDoorOnSeededRace() {
  return (
    g.race.format === RaceFormat.SEEDED &&
    g.race.goal !== RaceGoal.MOTHER &&
    g.race.goal !== RaceGoal.CUSTOM &&
    !g.race.solo
  );
}

/**
 * For races to The Beast, the player must go to Depths 2. Thus, we must prevent them from going to
 * the Mausoleum floors by deleting the doors.
 */
function shouldRemoveRepentanceDoorOnBeastRace() {
  return g.race.goal === RaceGoal.THE_BEAST && getEffectiveStage() === 5;
}

function removeRepentanceDoor() {
  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor === undefined) {
    return;
  }

  removeDoor(repentanceDoor);

  // When the door is spawned, the game creates dust clouds
  for (const effect of getEffects(EffectVariant.DUST_CLOUD)) {
    effect.Visible = false;
  }
}
