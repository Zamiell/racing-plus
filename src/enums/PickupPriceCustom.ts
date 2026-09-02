import { PickupPrice } from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";

/** `PickupPrice.ONE_HEART_AND_ONE_SOUL_HEART` (-9) is the final contiguous vanilla price value. */
const nextUnusedPickupPrice =
  asNumber(PickupPrice.ONE_HEART_AND_ONE_SOUL_HEART) - 1;

export const PickupPriceCustom = {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  PRICE_FREE_DEVIL_DEAL: nextUnusedPickupPrice as PickupPrice,
} as const;
