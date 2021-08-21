import {
  anyPlayerHasCollectible,
  DISTANCE_OF_GRID_SQUARE,
  getAngelRoomDoor,
  getDevilRoomDoor,
  getRoomIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const FRAME_LAYER = 3;
const NUM_DOOR_LAYERS = 5;

const v = {
  level: {
    devilAngelEntered: false,
  },

  room: {
    /** The combined door will always be the Devil Room door. */
    modifiedDevilDoorSlot: null as DoorSlot | null,
    /** The Angel Room door is made to be invisible. */
    hiddenAngelDoorSlot: null as DoorSlot | null,
  },
};

export function init(): void {
  saveDataManager("combinedDualityDoors", v);
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.combinedDualityDoors) {
    return;
  }

  if (v.room.hiddenAngelDoorSlot === null) {
    return;
  }

  const door = g.r.GetDoor(v.room.hiddenAngelDoorSlot);
  if (door === null) {
    return;
  }

  // Since the room is cleared, we must keep the door closed on every frame
  door.State = DoorState.STATE_CLOSED;
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

  // Make the Angel Room door invisible, if it exists
  // (we don't delete it because it can cause the game to crash if the player has Goat Head)
  const angelRoomDoor = getAngelRoomDoor();
  if (angelRoomDoor !== null) {
    // Delete the sprite
    const sprite = angelRoomDoor.GetSprite();
    for (let i = 0; i < NUM_DOOR_LAYERS; i++) {
      sprite.ReplaceSpritesheet(i, "gfx/none.png");
    }
    sprite.LoadGraphics();

    // The player will still be able to walk through the door, so set the state to add collision
    // Unfortunately, since the room is cleared, the door will attempt to open on every frame,
    // so we must also set the door state on every frame in the PostGridEntityUpdate callback
    angelRoomDoor.State = DoorState.STATE_CLOSED;
    v.room.hiddenAngelDoorSlot = angelRoomDoor.Slot;

    // When an Angel Room spawns, it will also emit a dust cloud
    const dustClouds = Isaac.FindByType(
      EntityType.ENTITY_EFFECT,
      EffectVariant.DUST_CLOUD,
    );
    for (const dustCloud of dustClouds) {
      if (
        dustCloud.Position.Distance(angelRoomDoor.Position) <
        DISTANCE_OF_GRID_SQUARE
      ) {
        dustCloud.Visible = false; // Necessary because it takes a frame to remove
        dustCloud.Remove();
      }
    }
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
