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

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_3_DOLLAR_BILL (191)
export function threeDollarBill(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seeded3DollarBill.postItemPickup3DollarBill(player);
}

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_MAGIC_8_BALL (194)
export function magic8Ball(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seededMagic8Ball.postItemPickupMagic8Ball(player);
}
