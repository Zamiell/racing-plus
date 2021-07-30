import g from "../../../globals";
import * as openRepentanceDoor from "../openRepentanceDoor";
import * as removeRepentanceDoor from "../removeRepentanceDoor";

export default function racePostRoomClear(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  openRepentanceDoor.postRoomClear();
  removeRepentanceDoor.postRoomClear();
}
