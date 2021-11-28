import {
  anyPlayerHasCollectible,
  copyColor,
  getCollectibleItemPoolType,
  getCollectibleMaxCharges,
  getCollectibles,
  isTaintedLazarus,
  removeCollectibleFromItemTracker,
  saveDataManager,
  setCollectibleSubType,
} from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { CollectibleTypeCustom } from "../../types/enums";

const OLD_ITEM = CollectibleType.COLLECTIBLE_FLIP;
const NEW_ITEM = CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM;
const FADE_AMOUNT = 0.33;
const FLIPPED_COLLECTIBLE_DRAW_OFFSET = Vector(-15, -15);
const COLLECTIBLE_LAYER = 1;

const v = {
  level: {
    /** Indexed by collectible InitSeed. */
    flippedCollectibleTypes: new Map<int, CollectibleType>(),
    flippedSprites: new Map<int, Sprite>(),
  },
};

export function init(): void {
  saveDataManager("flipCustom", v, featureEnabled);
}

function featureEnabled() {
  return config.flipCustom;
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM
export function useItemFlipCustom(player: EntityPlayer): boolean | void {
  if (!config.flipCustom) {
    return undefined;
  }

  for (const collectible of getCollectibles()) {
    const flippedCollectibleType = v.level.flippedCollectibleTypes.get(
      collectible.InitSeed,
    );

    // Do not convert items back to an empty pedestal
    // (this matches the behavior of the vanilla Flip)
    if (flippedCollectibleType === undefined || flippedCollectibleType === 0) {
      continue;
    }

    // Flip the items
    const oldCollectibleType = collectible.SubType;
    setCollectibleSubType(collectible, flippedCollectibleType);
    v.level.flippedCollectibleTypes.set(
      collectible.InitSeed,
      oldCollectibleType,
    );
  }

  // We also need to invoke the real Flip effect if we are Tainted Lazarus or Dead Tainted Lazarus
  if (isTaintedLazarus(player)) {
    player.UseActiveItem(
      CollectibleType.COLLECTIBLE_FLIP,
      false,
      false,
      false,
      false,
      -1,
    );
  }

  // Display the "Use" animation
  return true;
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer) {
  if (!config.flipCustom) {
    return;
  }

  // Automatically replace the vanilla flip with the custom one
  // (this handles Tainted Lazarus correctly, since he is given Flip in the normal active item slot)
  if (player.HasCollectible(OLD_ITEM)) {
    player.RemoveCollectible(OLD_ITEM);
    removeCollectibleFromItemTracker(OLD_ITEM);
    const charges = getCollectibleMaxCharges(NEW_ITEM);
    player.AddCollectible(NEW_ITEM, charges, false);
  }
}

// ModCallbacks.MC_POST_PICKUP_RENDER (36)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupRenderCollectible(
  collectible: EntityPickup,
  renderOffset: Vector,
): void {
  if (!config.flipCustom) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM)) {
    return;
  }

  let flippedCollectibleType = v.level.flippedCollectibleTypes.get(
    collectible.InitSeed,
  );
  if (flippedCollectibleType === undefined) {
    flippedCollectibleType = getNewFlippedCollectibleType(collectible);
    v.level.flippedCollectibleTypes.set(
      collectible.InitSeed,
      flippedCollectibleType,
    );
  }

  if (flippedCollectibleType === CollectibleType.COLLECTIBLE_NULL) {
    return;
  }

  let flippedSprite = v.level.flippedSprites.get(collectible.InitSeed);
  if (flippedSprite === undefined) {
    flippedSprite = initFlippedSprite(flippedCollectibleType);
  }

  const pickupRenderPosition = Isaac.WorldToRenderPosition(
    collectible.Position,
  );
  const renderPosition = pickupRenderPosition
    .add(renderOffset)
    .add(FLIPPED_COLLECTIBLE_DRAW_OFFSET);
  flippedSprite.RenderLayer(COLLECTIBLE_LAYER, renderPosition);
}

function getNewFlippedCollectibleType(collectible: EntityPickup) {
  const isFirstVisit = g.r.IsFirstVisit();
  const roomFrameCount = g.r.GetFrameCount();

  // The Flip effect is only supposed to happen to items that are part of the room layout
  if (!isFirstVisit || roomFrameCount > 0) {
    return CollectibleType.COLLECTIBLE_NULL;
  }

  const itemPoolType = getCollectibleItemPoolType(collectible);
  return g.itemPool.GetCollectible(itemPoolType, true, collectible.InitSeed);
}

function initFlippedSprite(collectibleType: CollectibleType) {
  const sprite = Sprite();
  sprite.Load("gfx/005.100_collectible.anm2", false);
  sprite.SetFrame("Idle", 0);

  const faded = copyColor(sprite.Color);
  faded.A = FADE_AMOUNT;
  sprite.Color = faded;

  const itemConfigItem = g.itemConfig.GetCollectible(collectibleType);
  if (itemConfigItem === undefined) {
    error(
      `Failed to get the item config for collectible type: ${collectibleType}`,
    );
  }
  sprite.ReplaceSpritesheet(COLLECTIBLE_LAYER, itemConfigItem.GfxFileName);
  sprite.LoadGraphics();

  return sprite;
}
