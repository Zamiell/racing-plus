/*

// EffectVariant.DEVIL (6)
export function devil(effect: EntityEffect): void {
  // Fade the statue if there are any collectibles in range
  // Tiles (5, 2), (6, 2), (7, 2), (5, 3), (6, 3), and (7, 3) are not allowed
  let collectibleIsClose = false;
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const collectible of collectibles) {
    if (
      collectible.Position.X >= 260 &&
      collectible.Position.X <= 380 &&
      collectible.Position.Y >= 180 &&
      collectible.Position.Y <= 260
    ) {
      collectibleIsClose = true;
      break;
    }
  }

  if (collectibleIsClose) {
    const faded = Color(1, 1, 1, 0.3, 0, 0, 0);
    effect.SetColor(faded, 1000, 0, true, true);
  }
}

*/
