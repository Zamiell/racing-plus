import { MAX_NUM_DOORS } from "../../../constants";
import g from "../../../globals";
import log from "../../../log";
import { moveEsauNextToJacob } from "../../../util";
import {
  anyPlayerCloserThan,
  enteredRoomViaTeleport,
  getAllDoors,
  getPlayers,
} from "../../../utilGlobals";

export function postNewRoom(): void {
  if (!g.config.teleportInvalidEntrance) {
    return;
  }

  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomShape = g.r.GetRoomShape();

  if (!enteredRoomViaTeleport()) {
    return;
  }

  // Don't bother fixing entrances in the Mom boss room
  if (stage === 6 && roomType === RoomType.ROOM_BOSS) {
    return;
  }

  if (isPlayerNextToADoor()) {
    return;
  }

  const [firstDoorSlot, firstDoorPosition] = getFirstDoorSlotAndPosition();
  if (firstDoorSlot === null || firstDoorPosition === null) {
    // Some rooms have no doors, like I AM ERROR rooms
    return;
  }

  // Don't bother fixing entrances in big room,
  // as teleporting the player to a valid door can cause the camera to jerk in a buggy way
  if (roomShape >= RoomShape.ROOMSHAPE_1x2) {
    log(
      "Not fixing an invalid entrance teleport due to being in a large room.",
    );
    return;
  }

  // They teleported to a non-existent entrance,
  // so manually move the players next to the first door in the room
  const position = getDoorEnterPosition(firstDoorSlot, firstDoorPosition);
  for (const player of getPlayers()) {
    player.Position = position;
  }
  moveEsauNextToJacob();

  // Also move the familiars
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  for (const familiar of familiars) {
    familiar.Position = position;
  }

  log("Fixed teleporting a player to an invalid entrance.");
}

function isPlayerNextToADoor() {
  for (const door of getAllDoors()) {
    if (
      door.TargetRoomType !== RoomType.ROOM_SECRET && // 7
      door.TargetRoomType !== RoomType.ROOM_SUPERSECRET // 8
    ) {
      if (anyPlayerCloserThan(door.Position, 60)) {
        return true;
      }
    }
  }

  return false;
}

function getFirstDoorSlotAndPosition(): [int | null, Vector | null] {
  for (let i = 0; i < MAX_NUM_DOORS; i++) {
    const door = g.r.GetDoor(i);
    if (
      door !== null &&
      door.TargetRoomType !== RoomType.ROOM_SECRET && // 7
      door.TargetRoomType !== RoomType.ROOM_SUPERSECRET // 8
    ) {
      return [i, door.Position];
    }
  }

  return [null, null];
}

function getDoorEnterPosition(doorSlot: DoorSlot, doorPosition: Vector) {
  // We can't move the player directly to the door position or they would just enter the loading
  // zone
  // Players always appear 40 units away from the door when entering a room,
  // so calculate the offset based on the door slot
  let x = doorPosition.X;
  let y = doorPosition.Y;
  if (doorSlot === DoorSlot.LEFT0 || doorSlot === DoorSlot.LEFT1) {
    x += 40;
  } else if (doorSlot === DoorSlot.UP0 || doorSlot === DoorSlot.UP1) {
    y += 40;
  } else if (doorSlot === DoorSlot.RIGHT0 || doorSlot === DoorSlot.RIGHT1) {
    x -= 40;
  } else if (doorSlot === DoorSlot.DOWN0 || doorSlot === DoorSlot.DOWN1) {
    y -= 40;
  }

  return Vector(x, y);
}
