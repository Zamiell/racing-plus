import { PickingUpItem } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as seeded3DollarBill from "../seeded3DollarBill";
import * as seededMagic8Ball from "../seededMagic8Ball";
import * as socket from "../socket";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postItemPickup(pickingUpItem);
  seeded3DollarBill.postItemPickup(player, pickingUpItem);
}

// ItemType.PASSIVE (1)
// CollectibleType.3_DOLLAR_BILL (191)
export function threeDollarBill(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seeded3DollarBill.postItemPickup3DollarBill(player);
}

// ItemType.PASSIVE (1)
// CollectibleType.MAGIC_8_BALL (194)
export function magic8Ball(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seededMagic8Ball.postItemPickupMagic8Ball(player);
}
