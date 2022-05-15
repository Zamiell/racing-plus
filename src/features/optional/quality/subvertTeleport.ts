// Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart,
// or It Lives!

import {
  DoorSlot,
  EntityType,
  PlayerType,
  RoomShape,
} from "isaac-typescript-definitions";
import {
  countEntities,
  forgottenSwitch,
  getFamiliars,
  getPlayers,
  isCharacter,
  log,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { moveEsauNextToJacob } from "../../../utils";

const ENTITIES_THAT_CAUSE_TELEPORT: ReadonlySet<EntityType> = new Set([
  EntityType.GURDY, // 36
  EntityType.MOM, // 45
  EntityType.MOMS_HEART, // 78
]);

const DOOR_SLOTS_REVERSED: { readonly [key in DoorSlot]: DoorSlot } = {
  // If we teleported into the room, use the default position.
  [DoorSlot.NO_DOOR_SLOT]: DoorSlot.DOWN_0,

  [DoorSlot.LEFT_0]: DoorSlot.RIGHT_0,
  [DoorSlot.UP_0]: DoorSlot.DOWN_0,
  [DoorSlot.RIGHT_0]: DoorSlot.LEFT_0,
  [DoorSlot.DOWN_0]: DoorSlot.UP_0,
  [DoorSlot.LEFT_1]: DoorSlot.RIGHT_0,
  [DoorSlot.UP_1]: DoorSlot.DOWN_0,
  [DoorSlot.RIGHT_1]: DoorSlot.LEFT_0,
  [DoorSlot.DOWN_1]: DoorSlot.UP_0,
};

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.subvertTeleport) {
    return;
  }

  if (shouldSubvertTeleport()) {
    subvertTeleport();
  }
}

function shouldSubvertTeleport() {
  const roomShape = g.r.GetRoomShape();

  // There are Double Trouble rooms with Gurdy but they don't cause a teleport.
  if (roomShape !== RoomShape.SHAPE_1x1) {
    return false;
  }

  for (const entityType of ENTITIES_THAT_CAUSE_TELEPORT.values()) {
    const numEntities = countEntities(entityType, -1, -1, true);
    if (numEntities > 0) {
      return true;
    }
  }

  return false;
}

function subvertTeleport() {
  const doorSlot = getRoomEnterDoorSlot();
  const position = g.r.GetDoorSlotPosition(doorSlot);

  for (const player of getPlayers()) {
    player.Position = position;

    // If we are The Soul, the Forgotten body will also need to be teleported.
    // However, if we change its position manually,
    // it will just warp back to the same spot on the next frame.
    // Thus, just manually switch to the Forgotten to avoid this bug.
    if (isCharacter(player, PlayerType.THE_SOUL)) {
      forgottenSwitch();
    }
  }

  moveEsauNextToJacob();

  // Also, account for familiars.
  for (const familiar of getFamiliars()) {
    familiar.Position = position;
  }

  log("Subverted a teleport.");
}

function getRoomEnterDoorSlot() {
  // We can't use "level.EnterDoor" because it gives a random result when in the Mom room.
  return DOOR_SLOTS_REVERSED[g.l.LeaveDoor];
}
