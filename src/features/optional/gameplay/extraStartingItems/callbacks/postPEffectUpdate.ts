import { game } from "isaacscript-common";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../constants";

/**
 * It is possible for players to get the placeholder items via the D4 or Tainted Eden getting
 * damaged. This is because the placeholder items are in pools. Check for this case and try to
 * handle it.
 */
export function extraStartingItemsPostPEffectUpdate(
  player: EntityPlayer,
): void {
  const itemPool = game.GetItemPool();

  for (const [
    placeholderCollectibleType,
    collectibleType,
  ] of COLLECTIBLE_REPLACEMENT_MAP) {
    if (!player.HasCollectible(placeholderCollectibleType, true)) {
      continue;
    }

    player.RemoveCollectible(placeholderCollectibleType);
    itemPool.RemoveCollectible(placeholderCollectibleType);

    // Prevent the situation where the player uses a D4 to roll into both e.g. Magic Mushroom and
    // Magic Mushroom Placeholder.
    if (player.HasCollectible(collectibleType, true)) {
      continue;
    }

    player.AddCollectible(collectibleType);
    itemPool.RemoveCollectible(collectibleType);
  }
}
