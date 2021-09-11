import {
  anyPlayerHasCollectible,
  DOOR_HITBOX_DISTANCE,
  getAngelRoomDoor,
  getDevilRoomDoor,
  log,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const FRAME_LAYER = 3;

const v = {
  room: {
    modifiedDevilDoorSlot: null as DoorSlot | null,
    initializedRoomType: null as RoomType | null,
  },
};

export function init(): void {
  saveDataManager("combinedDualityDoors", v);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.combinedDualityDoors) {
    return;
  }

  checkModifyDevilRoomDoor();
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (!config.combinedDualityDoors) {
    return;
  }

  if (v.room.modifiedDevilDoorSlot === null) {
    return;
  }

  const door = g.r.GetDoor(v.room.modifiedDevilDoorSlot);
  if (door === undefined) {
    return;
  }

  const inHitbox =
    door.Position.Distance(player.Position) <= DOOR_HITBOX_DISTANCE;
  if (!inHitbox) {
    return;
  }

  const playerOnDevilSide = getPlayerOnDevilSide(player, door);
  const targetRoomType = playerOnDevilSide
    ? RoomType.ROOM_DEVIL
    : RoomType.ROOM_ANGEL;
  if (targetRoomType === v.room.initializedRoomType) {
    return;
  }

  // If the room was already initialized,
  // then re-calling the "InitializeDevilAngelRoom()" method below will do nothing
  // We can work around this by deleting the room data, which will allow the method to work again
  const room = g.l.GetRoomByIdx(GridRooms.ROOM_DEVIL_IDX);
  room.Data = undefined;

  if (playerOnDevilSide) {
    g.l.InitializeDevilAngelRoom(false, true);
  } else {
    g.l.InitializeDevilAngelRoom(true, false);
  }

  const roomTypeString = playerOnDevilSide ? "Devil" : "Angel";
  log(`Initialized a ${roomTypeString} Room for the custom Duality mechanic.`);
}

function getPlayerOnDevilSide(player: EntityPlayer, door: GridEntityDoor) {
  const useYAxis = door.Slot % 2 === 0;
  const invertDirection = shouldInvertDirection(door.Slot);

  if (useYAxis) {
    if (invertDirection) {
      return player.Position.Y < door.Position.Y;
    }

    return player.Position.Y > door.Position.Y;
  }

  if (invertDirection) {
    return player.Position.X > door.Position.X;
  }

  return player.Position.X < door.Position.X;
}

function shouldInvertDirection(slot: DoorSlot) {
  return (
    slot === DoorSlot.RIGHT0 ||
    slot === DoorSlot.DOWN0 ||
    slot === DoorSlot.RIGHT1 ||
    slot === DoorSlot.DOWN1
  );
}

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.combinedDualityDoors) {
    return;
  }

  checkModifyDevilRoomDoor();
}

function checkModifyDevilRoomDoor() {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) {
    return;
  }

  // If we have already entered a Devil Room or an Angel Room, only that specific door will spawn
  const devilOrAngelRoom = g.l.GetRoomByIdx(GridRooms.ROOM_DEVIL_IDX);
  if (devilOrAngelRoom.VisitedCount > 0) {
    return;
  }

  // We only need to combine the doors if one of them is present without the other one
  const devilRoomDoor = getDevilRoomDoor();
  const angelRoomDoor = getAngelRoomDoor();
  if (devilRoomDoor === null && angelRoomDoor === null) {
    return;
  }
  if (devilRoomDoor !== null && angelRoomDoor !== null) {
    return;
  }
  const door = devilRoomDoor === null ? angelRoomDoor : devilRoomDoor;
  if (door === undefined) {
    return;
  }

  v.room.modifiedDevilDoorSlot = door.Slot;

  // Modify the sprite for the door so that it looks half Devil and half Angel
  const sprite = door.GetSprite();
  sprite.ReplaceSpritesheet(FRAME_LAYER, "gfx/grid/door_07_combineddoor.png");
  sprite.LoadGraphics();
}
