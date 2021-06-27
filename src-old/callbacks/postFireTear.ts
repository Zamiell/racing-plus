/*
export function main(tear: EntityTear): void {
  if (g.run.debugDamage) {
    tear.Scale = 5;
  }

  // The vanilla Lead Pencil counter accumulates even if the player does not have the item
  g.run.pencilCounter += 1;
  if (g.run.pencilCounter === 15) {
    g.run.pencilCounter = 0;
  }

  fixMonstrosLungSynergy(tear);
}

// Monstro's Lung does not properly synergize with 20/20, The Inner Eye, etc.
function fixMonstrosLungSynergy(tear: EntityTear) {
  if (g.run.firingExtraTear) {
    return;
  }

  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) && // 68
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) && // 114
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) && // 168
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  ) {
    let extraTears = 0;
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20)) {
      extraTears = 1;
    }
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE)) {
      extraTears = 2;
    }
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)) {
      extraTears = 3;
    }
    if (
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20) &&
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE)
    ) {
      extraTears = 4;
    }
    if (
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20) &&
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)
    ) {
      extraTears = 5;
    }
    if (
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) &&
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)
    ) {
      extraTears = 6;
    }
    if (
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20) &&
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) &&
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER)
    ) {
      extraTears = 8;
    }

    if (extraTears > 0) {
      for (let i = 1; i <= extraTears; i++) {
        g.run.firingExtraTear = true;
        g.p.FireTear(tear.Position, tear.Velocity, true, false, true);
        g.run.firingExtraTear = false;
      }
    }
  }
}
*/
