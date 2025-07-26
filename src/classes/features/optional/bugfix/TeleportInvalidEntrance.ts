import {
  DoorSlot,
  GridRoom,
  LevelStage,
  RoomShape,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
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
} from "isaacscript-common";
import { moveEsauNextToJacob } from "../../../../utils";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { isFastTravelHappening } from "../major/fastTravel/v";

const DOOR_HOLE_ROOM_TYPES = new ReadonlySet([
  RoomType.SECRET, // 7
  RoomType.SUPER_SECRET, // 8
]);

export class TeleportInvalidEntrance extends ConfigurableModFeature {
  configKey: keyof Config = "TeleportInvalidEntrance";

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const roomShape = room.GetRoomShape();

    if (!this.enteredRoomViaTeleport()) {
      return;
    }

    // Don't bother fixing entrances in the Mom boss room.
    if (
      onStage(LevelStage.DEPTHS_2)
      && inRoomType(RoomType.BOSS)
      && isRoomInsideGrid()
    ) {
      return;
    }

    if (this.isPlayerNextToADoor()) {
      return;
    }

    const firstDoor = this.getFirstNonSecretDoor();
    if (firstDoor === undefined) {
      // Some rooms have no doors, like I AM ERROR rooms.
      return;
    }

    // Don't bother fixing entrances in big room, as teleporting the player to a valid door can
    // cause the camera to jerk in a buggy way.
    if (roomShape >= RoomShape.SHAPE_1x2) {
      return;
    }

    // They teleported to a non-existent entrance. Manually move the players next to the first door
    // in the room. (We can't move the player directly to the door position or they would just enter
    // the loading zone.)
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

  enteredRoomViaTeleport(): boolean {
    const level = game.GetLevel();
    const previousRoomGridIndex = level.GetPreviousRoomIndex();
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();
    const justReachedThisFloor = inStartingRoom() && isFirstVisit;
    const cameFromDungeon =
      previousRoomGridIndex === asNumber(GridRoom.DUNGEON)
      || previousRoomGridIndex === asNumber(GridRoom.SECRET_SHOP);

    return (
      level.LeaveDoor === DoorSlot.NO_DOOR_SLOT
      && !justReachedThisFloor
      && !inRoomType(RoomType.DUNGEON)
      && !cameFromDungeon
      && !isFastTravelHappening()
    );
  }

  isPlayerNextToADoor(): boolean {
    const doors = getDoors();
    return doors.some(
      (door) =>
        !DOOR_HOLE_ROOM_TYPES.has(door.TargetRoomType)
        && anyPlayerCloserThan(door.Position, 60),
    );
  }

  getFirstNonSecretDoor(): GridEntityDoor | undefined {
    const doors = getDoors();
    return doors.find((door) => !DOOR_HOLE_ROOM_TYPES.has(door.TargetRoomType));
  }
}
