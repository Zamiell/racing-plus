import { season3PostRoomClearChanged } from "../season3/callbacks/postRoomClearChanged";
import { inSpeedrun } from "../speedrun";

export function speedrunPostRoomClearChanged(roomClear: boolean): void {
  if (!inSpeedrun()) {
    return;
  }

  season3PostRoomClearChanged(roomClear);
}
