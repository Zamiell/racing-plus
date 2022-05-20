import {
  CollectibleType,
  DoorSlot,
  GridRoom,
  RoomType,
} from "isaac-typescript-definitions";
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

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
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
  const targetRoomType = playerOnDevilSide ? RoomType.DEVIL : RoomType.ANGEL;
  if (targetRoomType === v.room.initializedRoomType) {
    return;
  }

  // If the room was already initialized, then re-calling the `Level.InitializeDevilAngelRoom`
  // method will do nothing. We can work around this by deleting the room data, which will allow the
  // method to work again.
  const roomDesc = g.l.GetRoomByIdx(GridRoom.DEVIL);
  roomDesc.Data = undefined;

  if (playerOnDevilSide) {
    g.l.InitializeDevilAngelRoom(false, true);
  } else {
    g.l.InitializeDevilAngelRoom(true, false);
  }

  const roomTypeString = playerOnDevilSide ? "Devil" : "Angel";
  log(`Initialized a ${roomTypeString} Room for the custom Duality mechanic.`);
}

function getPlayerOnDevilSide(player: EntityPlayer, door: GridEntityDoor) {
  const useYAxis = (door.Slot as int) % 2 === 0;
  const invertDirection = shouldInvertDirection(door.Slot);

  // We combine position and velocity to project where the player will be a frame from now. We do
  // this instead of simply using the position in order to be more accurate when the player is
  // moving diagonally.
  const projectedPosition = player.Position.add(player.Velocity);

  if (useYAxis) {
    if (invertDirection) {
      return projectedPosition.Y < door.Position.Y;
    }

    return projectedPosition.Y > door.Position.Y;
  }

  if (invertDirection) {
    return projectedPosition.X > door.Position.X;
  }

  return projectedPosition.X < door.Position.X;
}

function shouldInvertDirection(slot: DoorSlot) {
  return (
    slot === DoorSlot.RIGHT_0 ||
    slot === DoorSlot.DOWN_0 ||
    slot === DoorSlot.RIGHT_1 ||
    slot === DoorSlot.DOWN_1
  );
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.combinedDualityDoors) {
    return;
  }

  checkModifyDevilRoomDoor();
}

// ModCallback.PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.combinedDualityDoors) {
    return;
  }

  checkModifyDevilRoomDoor();
}

function checkModifyDevilRoomDoor() {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.BOSS) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.DUALITY)) {
    return;
  }

  // If we have already entered a Devil Room or an Angel Room, only that specific door will spawn.
  const devilOrAngelRoomDesc = g.l.GetRoomByIdx(GridRoom.DEVIL);
  if (devilOrAngelRoomDesc.VisitedCount > 0) {
    return;
  }

  // We only need to combine the doors if one of them is present without the other one.
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

  // Modify the sprite for the door so that it looks half Devil and half Angel.
  const sprite = door.GetSprite();
  sprite.ReplaceSpritesheet(FRAME_LAYER, "gfx/grid/door_07_combineddoor.png");
  sprite.LoadGraphics();
}
