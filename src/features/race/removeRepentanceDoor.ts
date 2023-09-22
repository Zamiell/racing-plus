import { EffectVariant, RoomType } from "isaac-typescript-definitions";
import {
  DISTANCE_OF_GRID_TILE,
  game,
  getEffects,
  getRepentanceDoor,
  inRoomType,
  onStageWithSecretExitToMausoleum,
  removeDoor,
} from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { g } from "../../globals";
import { inRaceToBeast, inSeededRace } from "./v";

// ModCallback.POST_NEW_ROOM (18)
export function postNewRoom(): void {
  checkRemoveRepentanceDoor();
}

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function preSpawnClearAward(): void {
  checkRemoveRepentanceDoor();
}

function checkRemoveRepentanceDoor() {
  const room = game.GetRoom();
  const roomClear = room.IsClear();

  if (!roomClear || !inRoomType(RoomType.BOSS)) {
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
    inSeededRace() &&
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
  return inRaceToBeast() && onStageWithSecretExitToMausoleum();
}

function removeRepentanceDoor() {
  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor === undefined) {
    return;
  }

  removeDoor(repentanceDoor);

  // When the door is spawned, the game creates dust clouds.
  for (const effect of getEffects(EffectVariant.DUST_CLOUD)) {
    if (
      effect.Position.Distance(repentanceDoor.Position) < DISTANCE_OF_GRID_TILE
    ) {
      effect.Visible = false;
    }
  }
}
