import { getEntityID } from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function main(player: EntityPlayer, pickup: EntityPickup): void {
  const entityID = getEntityID(pickup);
  Isaac.DebugString(`MC_POST_PURCHASE - ${entityID}`);

  // QoL
  chargePocketItemFirst.postPurchase(player, pickup);

  // Items
  flipCustom.postPurchase(player, pickup);
}
