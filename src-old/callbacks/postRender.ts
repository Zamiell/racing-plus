/*
// Make an additional charge bar for the Lead Pencil
function leadPencilChargeBar() {
  const character = g.p.GetPlayerType();
  const flyingOffset = g.p.GetFlyingOffset();

  if (
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_LEAD_PENCIL) ||
    character === PlayerType.PLAYER_AZAZEL || // 7
    character === PlayerType.PLAYER_LILITH || // 13
    character === PlayerType.PLAYER_THEFORGOTTEN || // 16
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) || // 52
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) || // 68
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  ) {
    return;
  }

  // Initialize the sprite
  if (g.run.pencilSprite === null) {
    g.run.pencilSprite = Sprite();
    g.run.pencilSprite.Load("gfx/chargebar_pencil.anm2", true);
  }

  // Adjust the position slightly so that it appears properly centered on the player,
  // taking into account the size of the player sprite and if there are any existing charge bars
  const adjustX = 18.5 * g.p.SpriteScale.X;
  let adjustY = 15 + 54 * g.p.SpriteScale.Y - flyingOffset.Y;
  const chargeBarHeight = 4.5;
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) || // 69
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) // 316
  ) {
    adjustY += chargeBarHeight;
    if (flyingOffset.Y !== 0) {
      // When the character has flying, the charge bar will overlap, so manually adjust for this
      adjustY -= 6; // 5 is too small and 6 is just right
    }
  }
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID)) {
    adjustY += chargeBarHeight;
  }
  const adjustedPosition = Vector(
    g.p.Position.X + adjustX,
    g.p.Position.Y - adjustY,
  );

  // Render it
  // (there are 101 frames in the "Charging animation" and it takes 15 shots to fire a pencil
  // barrage)
  let barFrame = g.run.pencilCounter * (101 / 15);
  barFrame = Math.round(barFrame);
  g.run.pencilSprite.SetFrame("Charging", barFrame);
  g.run.pencilSprite.Render(
    g.r.WorldToScreenPosition(adjustedPosition),
    Vector.Zero,
    Vector.Zero,
  );
}
*/
