import g from "../../../globals";
import openAntibirthDoor from "../openAntibirthDoor";
import removeAntibirthDoor from "../removeAntibirthDoor";

export default function racePostRoomClear(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  openAntibirthDoor();
  removeAntibirthDoor();
}
