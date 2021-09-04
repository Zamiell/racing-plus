import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function main(pickup: EntityPickup, player: EntityPlayer): void {
  chargePocketItemFirst.postPickupCollect(pickup, player);
}
