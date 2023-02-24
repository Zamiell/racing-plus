import {
  DoorSlot,
  GridRoom,
  LevelStage,
  RoomShape,
  RoomType,
} from "isaac-typescript-definitions";
import {
  anyPlayerCloserThan,
  asNumber,
  game,
  getAllPlayers,
  getDoorEnterPosition,
  getDoors,
  getFamiliars,
  inRoomType,
  inStartingRoom,
  isRoomInsideGrid,
  log,
  onStage,
  ReadonlySet,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { moveEsauNextToJacob } from "../../../utils";
import { isFastTravelHappening } from "../major/fastTravel/v";

const DOOR_HOLE_ROOM_TYPES = new ReadonlySet([
  RoomType.SECRET, // 7
  RoomType.SUPER_SECRET, // 8
]);

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.TeleportInvalidEntrance) {
    return;
  }

  const room = game.GetRoom();
  const roomShape = room.GetRoomShape();

  if (!enteredRoomViaTeleport()) {
    return;
  }

  // Don't bother fixing entrances in the Mom boss room.
  if (
    onStage(LevelStage.DEPTHS_2) &&
    inRoomType(RoomType.BOSS) &&
    isRoomInsideGrid()
  ) {
    return;
  }

  if (isPlayerNextToADoor()) {
    return;
  }

  const firstDoor = getFirstNonSecretDoor();
  if (firstDoor === undefined) {
    // Some rooms have no doors, like I AM ERROR rooms.
    return;
  }

  // Don't bother fixing entrances in big room, as teleporting the player to a valid door can cause
  // the camera to jerk in a buggy way.
  if (roomShape >= RoomShape.SHAPE_1x2) {
    log(
      "Not fixing an invalid entrance teleport due to being in a large room.",
    );
    return;
  }

  // They teleported to a non-existent entrance. Manually move the players next to the first door in
  // the room. (We can't move the player directly to the door position or they would just enter the
  // loading zone.)
  const position = getDoorEnterPosition(firstDoor);
  for (const player of getAllPlayers()) {
    player.Position = position;
  }
  moveEsauNextToJacob();

  // Also move the familiars.
  for (const familiar of getFamiliars()) {
    familiar.Position = position;
  }

  log("Fixed teleporting a player to an invalid entrance.");
}

function enteredRoomViaTeleport() {
  const level = game.GetLevel();
  const previousRoomGridIndex = level.GetPreviousRoomIndex();
  const room = game.GetRoom();
  const isFirstVisit = room.IsFirstVisit();
  const justReachedThisFloor = inStartingRoom() && isFirstVisit;
  const cameFromDungeon =
    previousRoomGridIndex === asNumber(GridRoom.DUNGEON) ||
    previousRoomGridIndex === asNumber(GridRoom.SECRET_SHOP);

  return (
    level.LeaveDoor === DoorSlot.NO_DOOR_SLOT &&
    !justReachedThisFloor &&
    !inRoomType(RoomType.DUNGEON) &&
    !cameFromDungeon &&
    !isFastTravelHappening()
  );
}

function isPlayerNextToADoor() {
  const doors = getDoors();
  return doors.some(
    (door) =>
      !DOOR_HOLE_ROOM_TYPES.has(door.TargetRoomType) &&
      anyPlayerCloserThan(door.Position, 60),
  );
}

function getFirstNonSecretDoor(): GridEntityDoor | undefined {
  const doors = getDoors();
  const nonSecretRoomDoors = doors.filter(
    (door) => !DOOR_HOLE_ROOM_TYPES.has(door.TargetRoomType),
  );

  return nonSecretRoomDoors[0];
}
