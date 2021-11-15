import { removeGridEntity } from "isaacscript-common";
import g from "../../globals";
import { RaceGoal } from "./types/RaceGoal";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkDeleteDoor();
}

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
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
    stage === 9 &&
    roomType === RoomType.ROOM_BOSS
  );
}

function deleteVoidDoor() {
  const voidDoor = g.r.GetDoor(DoorSlot.UP1);
  if (voidDoor === undefined) {
    return;
  }

  removeGridEntity(voidDoor);
  const wall = Isaac.GridSpawn(
    GridEntityType.GRID_WALL,
    0,
    voidDoor.Position,
    true,
  );

  // For some reason, spawned walls start with a collision class of COLLISION_NONE,
  // so we have to manually set it
  wall.CollisionClass = GridCollisionClass.COLLISION_WALL;
}
