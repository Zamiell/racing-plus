import { PickingUpItem } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as seeded3DollarBill from "../seeded3DollarBill";
import * as socket from "../socket";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItem);
  seeded3DollarBill.postItemPickup(player, pickingUpItem);
}

export function threeDollarBill(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seeded3DollarBill.postItemPickup3DollarBill(player);
}
