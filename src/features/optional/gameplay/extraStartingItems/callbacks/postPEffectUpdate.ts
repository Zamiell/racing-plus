import g from "../../../../../globals";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../constants";

/**
 * It is possible to use D4 to get the placeholder items, since they are in pools. Check for this
 * case and try to handle it.
 */
export function extraStartingItemsPostPEffectUpdate(
  player: EntityPlayer,
): void {
  for (const [
    placeholderCollectibleType,
    collectibleType,
  ] of COLLECTIBLE_REPLACEMENT_MAP.entries()) {
    if (!player.HasCollectible(placeholderCollectibleType)) {
      continue;
    }

    player.RemoveCollectible(placeholderCollectibleType);
    g.itemPool.RemoveCollectible(placeholderCollectibleType);

    // Prevent the situation where the player uses a D4 to roll into both e.g. Magic Mushroom and
    // Magic Mushroom Placeholder.
    if (player.HasCollectible(collectibleType)) {
      continue;
    }

    player.AddCollectible(collectibleType);
    g.itemPool.RemoveCollectible(collectibleType);
  }
}