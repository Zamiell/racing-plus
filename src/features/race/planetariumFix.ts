import { changeRoom, getRoomGridIndexesForType } from "isaacscript-common";
import g from "../../globals";
import { decrementRoomsEntered } from "../util/roomsEntered";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

/**
 * Planetariums have a greater chance of occurring if a Treasure Room is skipped, which can cause a
 * divergence in seeded races. In order to mitigate this, we force all players to visit every
 * Treasure Room and Planetarium in seeded races.
 */
export function planetariumFix(): void {
  if (
    g.race.format === RaceFormat.SEEDED &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
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
