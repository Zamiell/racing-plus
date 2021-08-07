import { PickingUpItem } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as socket from "../socket";

export default function racePostItemPickup(pickingUpItem: PickingUpItem): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItem);
}
