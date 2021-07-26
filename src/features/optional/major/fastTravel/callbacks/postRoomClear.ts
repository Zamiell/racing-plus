import g from "../../../../../globals";
import * as heavenDoor from "../heavenDoor";

export default function fastTravelPostRoomClear(): void {
  if (!g.config.fastTravel) {
    return;
  }

  heavenDoor.postRoomClear();
}
