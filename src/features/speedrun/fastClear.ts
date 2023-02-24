import { Dimension, LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  game,
  getAngelRoomDoor,
  getDevilRoomDoor,
  getDimension,
  getEffectiveStage,
  hasUnusedDoorSlot,
  inRoomType,
  isRoomInsideGrid,
  onRepentanceStage,
  removeDoor,
} from "isaacscript-common";
import { season3FastClear } from "../../classes/features/speedrun/season3/fastClear";
import { season3HasMotherGoal } from "../../classes/features/speedrun/season3/v";
import * as combinedDualityDoors from "../optional/quality/combinedDualityDoors";
import { inSpeedrun, onSeason } from "./speedrun";

export function speedrunPostFastClear(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkSpawnRepentanceDoor();
  season3FastClear();
}

/**
 * Paths to Repentance floors will not appear in custom challenges that have a goal of Blue Baby.
 * Thus, spawn the path manually if we are on a custom challenge. We only spawn them the
 * Downpour/Dross doors to avoid the bug where picking up Goat Head in a boss room and then
 * re-entering the room causes the Devil Room to become blocked.
 */
function checkSpawnRepentanceDoor() {
  const room = game.GetRoom();

  if (!speedrunShouldSpawnRepentanceDoor()) {
    return;
  }

  if (hasUnusedDoorSlot()) {
    room.TrySpawnSecretExit(true, true);
  } else {
    const devilRoomDoor = getDevilRoomDoor();
    const angelRoomDoor = getAngelRoomDoor();
    if (devilRoomDoor !== undefined && angelRoomDoor !== undefined) {
      // Both a Devil Room and an Angel Room door spawned, so there was no room left for the
      // Repentance door. Delete the Angel Room door and respawn the Repentance door.
      removeDoor(angelRoomDoor);
      room.TrySpawnSecretExit(true, true);

      // Combine the Devil Door with the Angel Room door.
      combinedDualityDoors.preSpawnClearAward();
    }
  }
}

export function speedrunShouldSpawnRepentanceDoor(): boolean {
  const room = game.GetRoom();
  const roomClear = room.IsClear();
  const insideGrid = isRoomInsideGrid();
  const dimension = getDimension();
  const correctStageForRepentanceDoor = isCorrectStageForRepentanceDoor();

  return (
    correctStageForRepentanceDoor &&
    inRoomType(RoomType.BOSS) &&
    insideGrid && // Handle the case of Emperor? card rooms.
    dimension === Dimension.MAIN &&
    roomClear
  );
}

function isCorrectStageForRepentanceDoor(): boolean {
  const effectiveStage = getEffectiveStage();
  const repentanceStage = onRepentanceStage();

  if (onSeason(3)) {
    if (!season3HasMotherGoal()) {
      return false;
    }

    return (
      // Basement 2 --> Downpour/Dross 2
      (effectiveStage === LevelStage.BASEMENT_2 && !repentanceStage) ||
      // Downpour/Dross 2 --> Mines/Ashpit 1
      (effectiveStage === LevelStage.CAVES_1 && repentanceStage) ||
      // Mines/Ashpit 2 --> Mausoleum/Gehenna 1
      (effectiveStage === LevelStage.DEPTHS_1 && repentanceStage)
    );
  }

  return (
    (effectiveStage === LevelStage.BASEMENT_1 ||
      effectiveStage === LevelStage.BASEMENT_2) &&
    !repentanceStage
  );
}
