import g from "../../globals";
import { removeGridEntity } from "../../utilGlobals";

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
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Hush" &&
    stage === 9 &&
    roomType === RoomType.ROOM_BOSS
  );
}

function deleteVoidDoor() {
  const voidDoor = g.r.GetDoor(DoorSlot.UP1);
  if (voidDoor !== null) {
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
}
