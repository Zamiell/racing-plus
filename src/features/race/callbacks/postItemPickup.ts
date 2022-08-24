import { PickingUpItem } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as socket from "../socket";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItem);
}
