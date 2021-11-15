import { GRID_INDEX_CENTER_OF_1X1_ROOM } from "isaacscript-common";
import g from "../../../../../globals";
import { shouldEnableFastClear } from "../shouldEnableFastClear";

export function fastClearPostNewRoom(): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkBugTwoHeavenDoors();
}

function checkBugTwoHeavenDoors() {
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  if (heavenDoors.length < 2) {
    return;
  }

  // There are two or more heaven doors in this room, which is assumed to be a bug
  // For example, this can happen if you die on the It Lives! fight on the save frame that the
  // vanilla Heaven Door spawns
  // Delete all of the heaven doors except for one
  // By default, prefer the heaven door that is in in the center of the room
  let heavenDoorIndexToKeep: int | undefined;
  for (const heavenDoor of heavenDoors) {
    const gridIndex = g.r.GetGridIndex(heavenDoor.Position);
    if (gridIndex === GRID_INDEX_CENTER_OF_1X1_ROOM) {
      heavenDoorIndexToKeep = heavenDoor.Index;
      break;
    }
  }
  if (heavenDoorIndexToKeep === undefined) {
    heavenDoorIndexToKeep = heavenDoors[0].Index;
  }

  for (const heavenDoor of heavenDoors) {
    if (heavenDoor.Index !== heavenDoorIndexToKeep) {
      heavenDoor.Remove();
    }
  }
}
