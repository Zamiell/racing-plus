// TODO Goat head crashes on seed G2PQ 1PPG
// TODO remove dust from right door on seed G2PQ 1PPG

import {
  anyPlayerHasCollectible,
  getAngelRoomDoor,
  getDevilRoomDoor,
  getRoomIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { removeGridEntity } from "../../../utilGlobals";

const FRAME_LAYER = 3;

const v = {
  level: {
    devilAngelEntered: false,
  },

  room: {
    modifiedDevilDoorSlot: null as DoorSlot | null,
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

  checkEnteredDevilAngelRoom();
  checkModifyDevilRoomDoor();
}

function checkEnteredDevilAngelRoom() {
  const roomIndex = getRoomIndex();

  if (roomIndex === GridRooms.ROOM_DEVIL_IDX) {
    v.level.devilAngelEntered = true;
  }
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
  if (v.level.devilAngelEntered) {
    return;
  }

  // If the Devil Room door does not exist, then we do not need to do anything
  const devilRoomDoor = getDevilRoomDoor();
  if (devilRoomDoor === null) {
    return;
  }

  v.room.modifiedDevilDoorSlot = devilRoomDoor.Slot;

  // Delete the Angel Room door, if it exists
  const angelRoomDoor = getAngelRoomDoor();
  if (angelRoomDoor !== null) {
    removeGridEntity(angelRoomDoor);
    Isaac.GridSpawn(GridEntityType.GRID_WALL, 0, angelRoomDoor.Position, true);
  }

  // Modify the sprite for the Devil Room door so that it looks half Devil and half Angel
  const sprite = devilRoomDoor.GetSprite();
  sprite.ReplaceSpritesheet(FRAME_LAYER, "gfx/grid/door_07_combineddoor.png");
  sprite.LoadGraphics();
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
  if (door === null) {
    return;
  }

  const playerOnDevilSide = getPlayerOnDevilSide(player, door);
  door.TargetRoomType = playerOnDevilSide
    ? RoomType.ROOM_DEVIL
    : RoomType.ROOM_ANGEL;
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
