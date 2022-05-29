import { PickupPrice } from "isaac-typescript-definitions";

/** "PickupPrice.ONE_HEART_AND_ONE_SOUL_HEART" is the final contiguous vanilla price value. */
const nextUnusedPickupPrice =
  (PickupPrice.ONE_HEART_AND_ONE_SOUL_HEART as int) - 1;

export const PickupPriceCustom = {
  PRICE_FREE_DEVIL_DEAL: nextUnusedPickupPrice as PickupPrice,
} as const;
