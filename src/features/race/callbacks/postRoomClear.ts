import g from "../../../globals";
import openAntibirthDoor from "../openAntibirthDoor";

export default function racePostRoomClear(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  openAntibirthDoor();
}
