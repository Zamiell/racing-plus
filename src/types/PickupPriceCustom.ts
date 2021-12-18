export enum PickupPriceCustom {
  // "PickupPrice.PRICE_SOUL" is the final contiguous vanilla price value
  PRICE_FREE_DEVIL_DEAL = PickupPrice.PRICE_SOUL - 1,

  // This can be any arbitrary value as long as it does not conflict with anything in the
  // PickupPrice enum
  PRICE_NO_MINIMAP = -50,
}
