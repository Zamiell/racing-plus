import { PickupDescription } from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function main(
  player: EntityPlayer,
  pickupDescription: PickupDescription,
): void {
  Isaac.DebugString(
    `MC_POST_PURCHASE - ${EntityType.ENTITY_PICKUP}.${pickupDescription.variant}.${pickupDescription.subType} - (${pickupDescription.position.X}, ${pickupDescription.position.Y}) - ${pickupDescription.initSeed}`,
  );

  // QoL
  chargePocketItemFirst.postPurchase(player, pickupDescription);

  // Items
  flipCustom.postPurchase(player, pickupDescription);
}
