import { GRID_INDEX_CENTER_OF_1X1_ROOM } from "isaacscript-common";
import g from "../../../../../globals";

export function fastClearPostNewRoom(): void {
  checkBugTwoHeavenDoors();
}

function checkBugTwoHeavenDoors() {
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
  );
  if (heavenDoors.length < 2) {
    return;
  }

  // There are two or more heaven doors in this room, which is assumed to be a bug
  // For example, this can happen if you die on the It Lives! fight on the save frame that the
  // vanilla Heaven Door spawns
  // Delete all of the heaven doors except for one
  // By default, prefer the heaven door that is in in the center of the room
  let heavenDoorIndexToKeep = null;
  for (const heavenDoor of heavenDoors) {
    const gridIndex = g.r.GetGridIndex(heavenDoor.Position);
    if (gridIndex === GRID_INDEX_CENTER_OF_1X1_ROOM) {
      heavenDoorIndexToKeep = heavenDoor.Index;
    }
  }
  if (heavenDoorIndexToKeep === null) {
    heavenDoorIndexToKeep = heavenDoors[0];
  }

  for (const heavenDoor of heavenDoors) {
    if (heavenDoor.Index !== heavenDoorIndexToKeep) {
      heavenDoor.Remove();
    }
  }
}
