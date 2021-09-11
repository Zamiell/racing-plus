const FADED = Color(1, 1, 1, 0.3, 0, 0, 0);
const X_DISTANCE = 35;
const Y_DISTANCE_ABOVE = 78;

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariant.DEVIL (6)
export function postEffectUpdateDevil(effect: EntityEffect): void {
  // Fade the statue if there are any collectibles in a rectangle above the effect
  const pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP);
  let pickupIsClose = false;
  for (const pickup of pickups) {
    if (
      pickup.Position.X >= effect.Position.X - X_DISTANCE &&
      pickup.Position.X <= effect.Position.X + X_DISTANCE &&
      pickup.Position.Y >= effect.Position.Y - Y_DISTANCE_ABOVE &&
      pickup.Position.Y <= effect.Position.Y
    ) {
      pickupIsClose = true;
      break;
    }
  }

  if (pickupIsClose) {
    effect.SetColor(FADED, 1000, 0, true, true);
  }
}
