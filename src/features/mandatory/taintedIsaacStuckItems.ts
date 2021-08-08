import { anyPlayerIs, log, saveDataManager } from "isaacscript-common";
import g from "../../globals";

const ITEM_SPRITESHEET_ID = 1;

const v = {
  room: {
    /** Used to keep an item static on Tainted Isaac. Index is the InitSeed of the collectible. */
    stuckItems: new LuaTable<int, CollectibleType>(),
  },
};

export function init(): void {
  saveDataManager("taintedIsaacStuckItems", v);
}

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
    const stuckCollectibleType = v.room.stuckItems.get(collectible.InitSeed);
    if (
      stuckCollectibleType !== undefined &&
      collectible.SubType !== stuckCollectibleType
    ) {
      // This item has switched, so restore it back to the way it was
      collectible.SubType = stuckCollectibleType;

      // Changing the subtype will not affect the existing sprite
      const sprite = collectible.GetSprite();
      const itemConfigItem = g.itemConfig.GetCollectible(stuckCollectibleType);
      if (itemConfigItem === null) {
        error(`Failed to get the item config for: ${stuckCollectibleType}`);
      }
      const gfxFileName = itemConfigItem.GfxFileName;
      sprite.ReplaceSpritesheet(ITEM_SPRITESHEET_ID, gfxFileName);
      sprite.LoadGraphics();

      log("Reset a quest item on Tainted Isaac.");
    }
  }
}

export function checkQuestItem(
  collectibleType: CollectibleType,
  seed: int,
): void {
  const itemConfigItem = g.itemConfig.GetCollectible(collectibleType);
  if (itemConfigItem !== null) {
    const isQuestItem = itemConfigItem.HasTags(ItemConfigTag.QUEST);
    if (isQuestItem) {
      v.room.stuckItems.set(seed, collectibleType);
    }
  }
}
