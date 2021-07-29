import { log } from "isaacscript-common";
import { MAX_NUM_DOORS } from "../../constants";
import g from "../../globals";
import { getPlayers, isAntibirthStage } from "../../utilGlobals";

export function postNewRoom(): void {
  const roomType = g.r.GetType();

  if (!shouldBanFirstFloorTreasureRoom()) {
    return;
  }

  if (roomType === RoomType.ROOM_TREASURE) {
    deleteAllItems();

    // Signal that we are not supposed to get the items in this room
    // If they are teleporting into the Treasure Room, the animation will not actually play,
    // but they will still be able to hear the sound effect
    for (const player of getPlayers()) {
      player.AnimateSad();
    }

    return;
  }

  // Delete the doors to the Basement 1 treasure room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  const roomIndex = g.l.QueryRoomTypeIndex(
    RoomType.ROOM_TREASURE,
    false,
    RNG(),
  );
  for (let i = 0; i < MAX_NUM_DOORS; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null && door.TargetRoomIndex === roomIndex) {
      g.r.RemoveDoor(i);
      log("Removed the Treasure Room door on B1.");
    }
  }

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  let roomDesc;
  if (MinimapAPI === null) {
    roomDesc = g.l.GetRoomByIdx(roomIndex);
    roomDesc.DisplayFlags = 0;
    g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
  } else {
    roomDesc = MinimapAPI.GetRoomByIdx(roomIndex);
    if (roomDesc !== null) {
      roomDesc.Remove();
    }
  }
}

function shouldBanFirstFloorTreasureRoom() {
  const stage = g.l.GetStage();

  return (
    stage === 1 &&
    !isAntibirthStage() &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.format === "seeded"
  );
}

function deleteAllItems() {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const collectible of collectibles) {
    collectible.Remove();
  }
}
