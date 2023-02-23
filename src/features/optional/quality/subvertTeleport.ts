// Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart, or
// It Lives!

import {
  DoorSlot,
  EntityType,
  PlayerType,
  RoomShape,
} from "isaac-typescript-definitions";
import {
  doesAnyEntityExist,
  game,
  getAllPlayers,
  getDoorSlotEnterPosition,
  getFamiliars,
  isCharacter,
  log,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";
import { moveEsauNextToJacob } from "../../../utils";

const ENTITY_TYPES_THAT_CAUSE_TELEPORT = [
  EntityType.GURDY, // 36
  EntityType.MOM, // 45
  EntityType.MOMS_HEART, // 78
] as const;

type OneByOneRoomDoorSlot =
  | DoorSlot.LEFT_0
  | DoorSlot.UP_0
  | DoorSlot.RIGHT_0
  | DoorSlot.DOWN_0;

// eslint-disable-next-line @typescript-eslint/naming-convention
const LEAVE_DOOR_SLOT_TO_1x1_DOOR_SLOT = {
  // If we teleported into the room, use the default position.
  [DoorSlot.NO_DOOR_SLOT]: DoorSlot.DOWN_0, // -1

  [DoorSlot.LEFT_0]: DoorSlot.RIGHT_0, // 0
  [DoorSlot.UP_0]: DoorSlot.DOWN_0, // 1
  [DoorSlot.RIGHT_0]: DoorSlot.LEFT_0, // 2
  [DoorSlot.DOWN_0]: DoorSlot.UP_0, // 3
  [DoorSlot.LEFT_1]: DoorSlot.RIGHT_0, // 4
  [DoorSlot.UP_1]: DoorSlot.DOWN_0, // 5
  [DoorSlot.RIGHT_1]: DoorSlot.LEFT_0, // 6
  [DoorSlot.DOWN_1]: DoorSlot.UP_0, // 7
} as const satisfies Record<DoorSlot, OneByOneRoomDoorSlot>;

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.SubvertTeleport) {
    return;
  }

  if (shouldSubvertTeleport()) {
    subvertTeleport();
  }
}

function shouldSubvertTeleport() {
  const room = game.GetRoom();
  const roomShape = room.GetRoomShape();

  // There are Double Trouble rooms with Gurdy but they don't cause a teleport.
  if (roomShape !== RoomShape.SHAPE_1x1) {
    return false;
  }

  return doesAnyEntityExist(ENTITY_TYPES_THAT_CAUSE_TELEPORT, true);
}

function subvertTeleport() {
  const doorSlot = getRoomEnterDoorSlot();
  const position = getDoorSlotEnterPosition(doorSlot);

  for (const player of getAllPlayers()) {
    player.Position = position;

    // If we are The Soul, the Forgotten body will also need to be teleported. However, if we change
    // its position manually, it will just warp back to the same spot on the next frame. Thus, just
    // manually switch to the Forgotten to avoid this bug.
    if (isCharacter(player, PlayerType.SOUL)) {
      mod.forgottenSwitch(player);
    }
  }

  moveEsauNextToJacob();

  // Also, account for familiars.
  for (const familiar of getFamiliars()) {
    familiar.Position = position;
  }

  log("Subverted a teleport.");
}

/**
 * - We can't use "level.EnterDoor" because it gives a random result when in the Mom room.
 * - We don't use the `getOppositeDoorSlot` helper function because that will not work properly //
 *   when going from a big room to a 1x1 room. (The subvert teleport feature will only happen in a
 *   1x1 room.)
 */
function getRoomEnterDoorSlot(): OneByOneRoomDoorSlot {
  const level = game.GetLevel();
  return LEAVE_DOOR_SLOT_TO_1x1_DOOR_SLOT[level.LeaveDoor];
}
