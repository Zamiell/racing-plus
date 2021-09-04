import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function main(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
  pickupSubType: int,
  _pickupPrice: int,
): void {
  chargePocketItemFirst.postPurchase(player, pickupVariant, pickupSubType);
}
