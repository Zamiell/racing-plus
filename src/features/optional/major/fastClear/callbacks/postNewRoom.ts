import {
  getEffects,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  removeEntities,
} from "isaacscript-common";
import g from "../../../../../globals";
import { shouldEnableFastClear } from "../shouldEnableFastClear";

export function fastClearPostNewRoom(): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkBugTwoHeavenDoors();
}

function checkBugTwoHeavenDoors() {
  const heavenDoors = getEffects(
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
  const heavenDoorInCenter = heavenDoors.find((heavenDoor) => {
    const gridIndex = g.r.GetGridIndex(heavenDoor.Position);
    return gridIndex === GRID_INDEX_CENTER_OF_1X1_ROOM;
  });
  const firstHeavenDoor = heavenDoors[0];
  const heavenDoorToKeep =
    heavenDoorInCenter === undefined ? firstHeavenDoor : heavenDoorInCenter;
  const heavenDoorsToRemove = heavenDoors.filter(
    (heavenDoor) => heavenDoor.Index !== heavenDoorToKeep.Index,
  );
  removeEntities(heavenDoorsToRemove);
}
