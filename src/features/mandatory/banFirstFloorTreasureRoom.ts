import {
  getEffectiveStage,
  getPlayers,
  log,
  MAX_NUM_DOORS,
  removeAllCollectibles,
} from "isaacscript-common";
import g from "../../globals";
import { RaceFormat } from "../race/types/RaceFormat";
import { RacerStatus } from "../race/types/RacerStatus";
import { RaceStatus } from "../race/types/RaceStatus";
import { ChallengeCustom } from "../speedrun/enums";

export function postNewRoom(): void {
  const roomType = g.r.GetType();

  if (!shouldBanFirstFloorTreasureRoom()) {
    return;
  }

  if (roomType === RoomType.ROOM_TREASURE) {
    removeAllCollectibles();

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
  const roomGridIndex = g.l.QueryRoomTypeIndex(
    RoomType.ROOM_TREASURE,
    false,
    RNG(),
  );
  for (let i = 0; i < MAX_NUM_DOORS; i++) {
    const door = g.r.GetDoor(i);
    if (door !== undefined && door.TargetRoomIndex === roomGridIndex) {
      g.r.RemoveDoor(i);
      log("Removed the Treasure Room door on B1.");
    }
  }

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  if (MinimapAPI === undefined) {
    const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
    roomDesc.DisplayFlags = 0;
    g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
  } else {
    const roomDesc = MinimapAPI.GetRoomByIdx(roomGridIndex);
    if (roomDesc !== undefined) {
      roomDesc.Remove();
    }
  }
}

function shouldBanFirstFloorTreasureRoom() {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();

  return (
    effectiveStage === 1 &&
    ((g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.myStatus === RacerStatus.RACING &&
      g.race.format === RaceFormat.SEEDED) ||
      challenge === ChallengeCustom.SEASON_2)
  );
}
