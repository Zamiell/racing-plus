import { PickingUpItem } from "isaacscript-common";
import g from "../../../globals";
import * as socket from "../socket";

export default function racePostItemPickup(pickingUpItem: PickingUpItem): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItem);
}
