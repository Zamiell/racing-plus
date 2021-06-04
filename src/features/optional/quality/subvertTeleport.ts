// Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart,
// or It Lives!

import g from "../../../globals";
import { getPlayers, log, moveEsauNextToJacob } from "../../../misc";

const ENTITIES_THAT_CAUSE_TELEPORT = [
  EntityType.ENTITY_GURDY, // 36
  EntityType.ENTITY_MOM, // 45
  EntityType.ENTITY_MOMS_HEART, // 78
];

export function postNewRoom(): void {
  if (!g.config.subvertTeleport) {
    return;
  }

  if (shouldSubvertTeleport()) {
    subvertTeleport();
    if (shouldForceMomStomp()) {
      forceMomStomp();
    }
  }
}

function shouldSubvertTeleport() {
  const roomShape = g.r.GetRoomShape();

  // There are Double Trouble rooms with Gurdy but they don't cause a teleport
  if (roomShape !== RoomShape.ROOMSHAPE_1x1) {
    return false;
  }

  for (const entityType of ENTITIES_THAT_CAUSE_TELEPORT) {
    const entities = Isaac.FindByType(entityType, -1, -1, false, true);
    if (entities.length > 0) {
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
      g.run.switchForgotten = true;
    }
  }

  moveEsauNextToJacob();

  // Also, account for familiars
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  for (const familiar of familiars) {
    familiar.Position = normalPosition;
  }

  log("Subverted a teleport.");
}

function getNormalRoomEnterPosition() {
  // We can't use "level.EnterDoor" because it gives a random result when in the Mom room
  switch (g.l.LeaveDoor) {
    // 0 (2x2 left top)
    case DoorSlot.LEFT0: {
      return Vector(560, 280); // (the default position if you enter the room from the right door)
    }

    // 1 (2x2 top left)
    case DoorSlot.UP0: {
      return Vector(320, 400); // (the default position if you enter the room from the bottom door)
    }

    // 2 (2x2 right top)
    case DoorSlot.RIGHT0: {
      return Vector(80, 280); // (the default position if you enter the room from the left door)
    }

    // 3 (2x2 bottom left)
    case DoorSlot.DOWN0: {
      return Vector(320, 160); // (the default position if you enter the room from the top door)
    }

    // 4 (2x2 left bottom)
    case DoorSlot.LEFT1: {
      return Vector(560, 280); // (the default position if you enter the room from the right door)
    }

    // 5 (2x2 top right)
    case DoorSlot.UP1: {
      return Vector(320, 400); // (the default position if you enter the room from the bottom door)
    }

    // 6 (2x2 right bottom)
    case DoorSlot.RIGHT1: {
      return Vector(80, 280); // (the default position if you enter the room from the left door)
    }

    // 7 (2x2 bottom right)
    case DoorSlot.DOWN1: {
      return Vector(320, 160); // (the default position if you enter the room from the top door)
    }

    default: {
      // If we teleported into the room, use the default position
      return Vector(320, 400); // (the default position if you enter the room from the bottom door)
    }
  }
}

function shouldForceMomStomp() {
  const moms = Isaac.FindByType(EntityType.ENTITY_MOM, -1, -1, false, true);
  return moms.length > 0;
}

function forceMomStomp() {
  // TODO
}
