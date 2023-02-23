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
  inStartingRoom,
  isRoomInsideGrid,
  log,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { moveEsauNextToJacob } from "../../../utils";
import { isFastTravelHappening } from "../major/fastTravel/v";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.TeleportInvalidEntrance) {
    return;
  }

  const level = game.GetLevel();
  const stage = level.GetStage();
  const room = game.GetRoom();
  const roomType = room.GetType();
  const roomShape = room.GetRoomShape();

  if (!enteredRoomViaTeleport()) {
    return;
  }

  // Don't bother fixing entrances in the Mom boss room.
  if (
    stage === LevelStage.DEPTHS_2 &&
    roomType === RoomType.BOSS &&
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
  const roomType = room.GetType();
  const isFirstVisit = room.IsFirstVisit();
  const justReachedThisFloor = inStartingRoom() && isFirstVisit;
  const inDungeon = roomType === RoomType.DUNGEON;
  const cameFromDungeon =
    previousRoomGridIndex === asNumber(GridRoom.DUNGEON) ||
    previousRoomGridIndex === asNumber(GridRoom.SECRET_SHOP);

  return (
    level.LeaveDoor === DoorSlot.NO_DOOR_SLOT &&
    !justReachedThisFloor &&
    !inDungeon &&
    !cameFromDungeon &&
    !isFastTravelHappening()
  );
}

function isPlayerNextToADoor() {
  for (const door of getDoors()) {
    if (
      door.TargetRoomType !== RoomType.SECRET && // 7
      door.TargetRoomType !== RoomType.SUPER_SECRET // 8
    ) {
      if (anyPlayerCloserThan(door.Position, 60)) {
        return true;
      }
    }
  }

  return false;
}

function getFirstNonSecretDoor(): GridEntityDoor | undefined {
  const doors = getDoors();
  const nonSecretRoomDoors = doors.filter(
    (door) =>
      door.TargetRoomType !== RoomType.SECRET &&
      door.TargetRoomType !== RoomType.SUPER_SECRET,
  );

  return nonSecretRoomDoors[0];
}
