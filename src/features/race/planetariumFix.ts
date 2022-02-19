import { changeRoom, getRoomGridIndexesForType } from "isaacscript-common";
import { decrementRoomsEntered } from "../util/roomsEntered";
import { inSeededRace } from "./util";

/**
 * Planetariums have a greater chance of occurring if a Treasure Room is skipped, which can cause a
 * divergence in seeded races. In order to mitigate this, we force all players to visit every
 * Treasure Room and Planetarium in seeded races.
 */
export function planetariumFix(): void {
  if (!inSeededRace()) {
    return;
  }

  const warpGridIndexes = getRoomGridIndexesForType(
    RoomType.ROOM_TREASURE,
    RoomType.ROOM_PLANETARIUM,
  );
  for (const gridIndex of warpGridIndexes) {
    changeRoom(gridIndex);
    decrementRoomsEntered(); // This should not count as entering a room
  }
}
