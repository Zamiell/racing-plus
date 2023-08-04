import type { PickingUpItem } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as socket from "../socket";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  if (!config.ClientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItem);
}
