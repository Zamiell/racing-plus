import * as flipCustom from "../features/items/flipCustom";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function main(player: EntityPlayer, pickup: EntityPickup): void {
  // QoL
  chargePocketItemFirst.postPurchase(player, pickup);

  // Items
  flipCustom.postPurchase(player, pickup);
}
