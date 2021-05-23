import g from "../../../globals";
import { enteredRoomViaTeleport, getPlayers } from "../../../misc";

export function postNewRoom(): void {
  if (!g.config.fixTeleportInvalidEntrance) {
    return;
  }

  const roomShape = g.r.GetRoomShape();

  if (!enteredRoomViaTeleport()) {
    return;
  }

  // Don't bother fixing entrances in big room,
  // as teleporting the player to a valid door can cause the camera to jerk in a buggy way
  if (roomShape >= RoomShape.ROOMSHAPE_1x2) {
    return;
  }

  // Check to see if they are at an entrance
  let nextToADoor = false;
  let firstDoorSlot: int | null = null;
  let firstDoorPosition: Vector | null = null;
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (
      door !== null &&
      door.TargetRoomType !== RoomType.ROOM_SECRET && // 7
      door.TargetRoomType !== RoomType.ROOM_SUPERSECRET // 8
    ) {
      if (firstDoorSlot === null) {
        firstDoorSlot = i;
        firstDoorPosition = Vector(door.Position.X, door.Position.Y);
      }
      if (door.Position.Distance(g.p.Position) < 60) {
        nextToADoor = true;
        break;
      }
    }
  }

  // Some rooms have no doors, like I AM ERROR rooms
  if (!nextToADoor && firstDoorSlot !== null && firstDoorPosition !== null) {
    // They teleported to a non-existent entrance,
    // so manually move the players next to the first door in the room
    const doorOffset = getDoorEnterPosition(firstDoorSlot, firstDoorPosition);
    for (const player of getPlayers()) {
      player.Position = doorOffset;
    }

    // Also move the familiars
    const familiars = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      -1,
      -1,
      false,
      false,
    );
    for (const familiar of familiars) {
      familiar.Position = doorOffset;
    }
  }
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
