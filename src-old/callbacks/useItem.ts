/*

export function main(collectibleType: CollectibleType): void {
  const gameFrameCount = g.g.GetFrameCount();
  const activeItem = player.GetActiveItem();
  const activeCharge = player.GetActiveCharge();
  const batteryCharge = player.GetBatteryCharge();
  const activeItemMaxCharges = misc.getItemMaxCharges(activeItem);

  // Fix The Battery + 9 Volt synergy (1/2)
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_NINE_VOLT) &&
    activeItemMaxCharges >= 2 &&
    activeCharge === activeItemMaxCharges &&
    batteryCharge === activeItemMaxCharges
  ) {
    g.run.giveExtraCharge = true;
  }
}

*/
