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
  useActiveItemTemp,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "../../constants";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { initItemSprite } from "../../sprite";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../optional/gameplay/extraStartingItems/constants";

const OLD_ITEM = CollectibleType.COLLECTIBLE_FLIP;
const NEW_ITEM = CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM;
const FADE_AMOUNT = 0.33;
const FLIPPED_COLLECTIBLE_DRAW_OFFSET = Vector(-15, -15);

const v = {
  level: {
    /**
     * Indexed by collectible PtrHash.
     * (PtrHash is consistent across rerolls, while InitSeed is not.)
     */
    flippedCollectibleTypes: new Map<PtrHash, CollectibleType>(),

    /**
     * Indexed by collectible PtrHash.
     * (PtrHash is consistent across rerolls, while InitSeed is not.)
     */
    flippedSprites: new Map<PtrHash, Sprite>(),
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
    const ptrHash = GetPtrHash(collectible);
    const flippedCollectibleType = v.level.flippedCollectibleTypes.get(ptrHash);

    // Do not convert items back to an empty pedestal
    // (this matches the behavior of the vanilla Flip)
    if (flippedCollectibleType === undefined || flippedCollectibleType === 0) {
      continue;
    }

    // Flip the items
    const oldCollectibleType = collectible.SubType;
    setCollectibleSubType(collectible, flippedCollectibleType);
    v.level.flippedCollectibleTypes.set(ptrHash, oldCollectibleType);
  }

  // We also need to invoke the real Flip effect if we are Tainted Lazarus or Dead Tainted Lazarus
  if (isTaintedLazarus(player)) {
    useActiveItemTemp(player, CollectibleType.COLLECTIBLE_FLIP);
  }

  // Display the "Use" animation
  return true;
}

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer) {
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

// ModCallbacks.MC_POST_PICKUP_INIT (34)
export function postPickupInitCollectible(collectible: EntityPickup): void {
  if (!config.flipCustom) {
    return;
  }

  if (!anyPlayerHasCollectible(NEW_ITEM)) {
    return;
  }

  const ptrHash = GetPtrHash(collectible);
  const flippedCollectibleType = v.level.flippedCollectibleTypes.get(ptrHash);
  if (flippedCollectibleType !== undefined) {
    return;
  }

  const newCollectibleType = getNewFlippedCollectibleType(collectible);
  v.level.flippedCollectibleTypes.set(ptrHash, newCollectibleType);
}

function getNewFlippedCollectibleType(collectible: EntityPickup) {
  const isFirstVisit = g.r.IsFirstVisit();
  const roomFrameCount = g.r.GetFrameCount();

  // The Flip effect is only supposed to happen to items that are part of the room layout
  if (!isFirstVisit || roomFrameCount > 0) {
    return CollectibleType.COLLECTIBLE_NULL;
  }

  const itemPoolType = getCollectibleItemPoolType(collectible);
  const collectibleType = g.itemPool.GetCollectible(
    itemPoolType,
    true,
    collectible.InitSeed,
  );

  const replacementCollectibleType =
    COLLECTIBLE_REPLACEMENT_MAP.get(collectibleType);
  return replacementCollectibleType === undefined
    ? collectibleType
    : replacementCollectibleType;
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

  if (!anyPlayerHasCollectible(NEW_ITEM)) {
    return;
  }

  const ptrHash = GetPtrHash(collectible);
  const flippedCollectibleType = v.level.flippedCollectibleTypes.get(ptrHash);
  if (
    flippedCollectibleType === undefined ||
    flippedCollectibleType === CollectibleType.COLLECTIBLE_NULL
  ) {
    return;
  }

  let flippedSprite = v.level.flippedSprites.get(ptrHash);
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

function initFlippedSprite(collectibleType: CollectibleType) {
  const sprite = initItemSprite(collectibleType);

  const faded = copyColor(sprite.Color);
  faded.A = FADE_AMOUNT;
  sprite.Color = faded;

  return sprite;
}
