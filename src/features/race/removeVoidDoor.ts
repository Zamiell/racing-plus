import {
  DoorSlot,
  GridEntityType,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import { isRoomInsideGrid, spawnGridEntity } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkDeleteDoor();
}

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function preSpawnClearAward(): void {
  checkDeleteDoor();
}

function checkDeleteDoor() {
  if (shouldDeleteVoidDoor()) {
    deleteVoidDoor();
  }
}

function shouldDeleteVoidDoor() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  return (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    stage === LevelStage.BLUE_WOMB &&
    roomType === RoomType.BOSS &&
    isRoomInsideGrid()
  );
}

function deleteVoidDoor() {
  const voidDoor = g.r.GetDoor(DoorSlot.UP_1);
  if (voidDoor === undefined) {
    return;
  }

  // Spawning a wall on top of the door will automatically delete the door.
  const gridIndex = voidDoor.GetGridIndex();
  spawnGridEntity(GridEntityType.WALL, gridIndex);
}
