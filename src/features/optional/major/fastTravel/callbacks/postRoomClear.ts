import g from "../../../../../globals";
import * as heavenDoor from "../heavenDoor";

export function main(): void {
  if (!g.config.fastTravel) {
    return;
  }

  heavenDoor.postRoomClear();
}
