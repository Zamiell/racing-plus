import g from "../../../globals";
import * as openAntibirthDoor from "../openAntibirthDoor";
import * as removeAntibirthDoor from "../removeAntibirthDoor";

export default function racePostRoomClear(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  openAntibirthDoor.postRoomClear();
  removeAntibirthDoor.postRoomClear();
}
