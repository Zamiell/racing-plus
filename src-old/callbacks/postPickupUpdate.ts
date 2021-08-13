/*
// PickupVariant.PICKUP_COIN (20)
export function coin(pickup: EntityPickup): void {
  const sprite = pickup.GetSprite();
  const data = pickup.GetData();

  if (pickup.SubType === CoinSubType.COIN_STICKYNICKEL) {
    if (sprite.IsPlaying("Touched")) {
      sprite.Play("TouchedStick", true);
    }
  } else if (data.WasStickyNickel) {
    // Check for our WasStickyNickel data
    data.WasStickyNickel = false;
    sprite.Load("gfx/005.022_nickel.anm2", true); // Revert the nickel sprite to the original sprite
    sprite.Play("Idle", true);
  }
}
*/
