import { anyPlayerIs, log } from "isaacscript-common";
import g from "../../globals";

const ITEM_SPRITESHEET_ID = 1;

// Keep specific items from being affected by the Tainted Isaac switching mechanic
export function postUpdate(): void {
  if (!anyPlayerIs(PlayerType.PLAYER_ISAAC_B)) {
    return;
  }

  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const collectible of collectibles) {
    const stuckCollectibleType = g.run.room.stuckItems.get(
      collectible.InitSeed,
    );
    if (
      stuckCollectibleType !== undefined &&
      collectible.SubType !== stuckCollectibleType
    ) {
      // This item has switched, so restore it back to the way it was
      collectible.SubType = stuckCollectibleType;

      // Changing the subtype will not affect the existing sprite
      const sprite = collectible.GetSprite();
      const itemConfigItem = g.itemConfig.GetCollectible(stuckCollectibleType);
      const gfxFileName = itemConfigItem.GfxFileName;
      sprite.ReplaceSpritesheet(ITEM_SPRITESHEET_ID, gfxFileName);
      sprite.LoadGraphics();

      log("Reset a quest item on Tainted Isaac.");
    }
  }
}
