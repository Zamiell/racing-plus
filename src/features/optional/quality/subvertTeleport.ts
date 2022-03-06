// Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart,
// or It Lives!

import {
  countEntities,
  forgottenSwitch,
  getFamiliars,
  getPlayers,
  log,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { moveEsauNextToJacob } from "../../../utils";

const ENTITIES_THAT_CAUSE_TELEPORT: ReadonlySet<EntityType> = new Set([
  EntityType.ENTITY_GURDY, // 36
  EntityType.ENTITY_MOM, // 45
  EntityType.ENTITY_MOMS_HEART, // 78
]);

const TOP_DOOR_POSITION = Vector(320, 160);
const LEFT_DOOR_POSITION = Vector(80, 280);
const RIGHT_DOOR_POSITION = Vector(560, 280);
const BOTTOM_DOOR_POSITION = Vector(320, 400);

// ModCallbacks.MC_POST_NEW_ROOM (19)
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

  // There are Double Trouble rooms with Gurdy but they don't cause a teleport
  if (roomShape !== RoomShape.ROOMSHAPE_1x1) {
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
  const normalPosition = getNormalRoomEnterPosition();

  for (const player of getPlayers()) {
    player.Position = normalPosition;

    // If we are The Soul, the Forgotten body will also need to be teleported
    // However, if we change its position manually,
    // it will just warp back to the same spot on the next frame
    // Thus, just manually switch to the Forgotten to avoid this bug
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_THESOUL) {
      forgottenSwitch();
    }
  }

  moveEsauNextToJacob();

  // Also, account for familiars
  for (const familiar of getFamiliars()) {
    familiar.Position = normalPosition;
  }

  log("Subverted a teleport.");
}

function getNormalRoomEnterPosition() {
  // We can't use "level.EnterDoor" because it gives a random result when in the Mom room
  switch (g.l.LeaveDoor) {
    // 0 (2x2 left top)
    case DoorSlot.LEFT0: {
      return RIGHT_DOOR_POSITION;
    }

    // 1 (2x2 top left)
    case DoorSlot.UP0: {
      return BOTTOM_DOOR_POSITION;
    }

    // 2 (2x2 right top)
    case DoorSlot.RIGHT0: {
      return LEFT_DOOR_POSITION;
    }

    // 3 (2x2 bottom left)
    case DoorSlot.DOWN0: {
      return TOP_DOOR_POSITION;
    }

    // 4 (2x2 left bottom)
    case DoorSlot.LEFT1: {
      return RIGHT_DOOR_POSITION;
    }

    // 5 (2x2 top right)
    case DoorSlot.UP1: {
      return BOTTOM_DOOR_POSITION;
    }

    // 6 (2x2 right bottom)
    case DoorSlot.RIGHT1: {
      return LEFT_DOOR_POSITION;
    }

    // 7 (2x2 bottom right)
    case DoorSlot.DOWN1: {
      return TOP_DOOR_POSITION;
    }

    default: {
      // If we teleported into the room, use the default position
      return BOTTOM_DOOR_POSITION;
    }
  }
}
