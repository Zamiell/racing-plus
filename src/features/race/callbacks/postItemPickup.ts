import g from "../../../globals";
import PickingUpItemDescription from "../../../types/PickingUpItemDescription";
import * as socket from "../socket";

export function main(pickingUpItemDescription: PickingUpItemDescription): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItemDescription);
}
