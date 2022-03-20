import {
  anyPlayerHasCollectible,
  copyColor,
  DefaultMap,
  getCollectibleItemPoolType,
  getCollectibleMaxCharges,
  getCollectibles,
  getRoomListIndex,
  isTaintedLazarus,
  removeCollectibleFromItemTracker,
  saveDataManager,
  setCollectibleSubType,
  spawnEmptyCollectible,
  useActiveItemTemp,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "../../constants";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { initItemSprite } from "../../sprite";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../optional/gameplay/extraStartingItems/constants";

const OLD_COLLECTIBLE_TYPE = CollectibleType.COLLECTIBLE_FLIP;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM;
const FADE_AMOUNT = 0.33;
const FLIPPED_COLLECTIBLE_DRAW_OFFSET = Vector(-15, -15);

/** See the documentation for the `flippedCollectibleTypes` map. */
type FlippedCollectibleIndex = string & {
  __flippedCollectibleIndexBrand: unknown;
};

function getFlippedCollectibleIndex(collectible: EntityPickup) {
  const roomListIndex = getRoomListIndex();
  const gridIndex = g.r.GetGridIndex(collectible.Position);

  return `${roomListIndex},${gridIndex}` as FlippedCollectibleIndex;
}

const v = {
  level: {
    /**
     * Indexed by a tuple of room list index and collectible grid index. (In vanilla, rolling a
     * collectible will not roll the flipped collectible type.)
     *
     * - We can't use InitSeed, since that changes after a reroll.
     * - We can't use CollectibleIndex, since that changes after a reroll.
     * - We can't use PtrHash, since that is no longer valid once you leave the room.
     * - We ignore the edge-case of the Flipped collectible type persisting to post-Ascent Treasure
     * Rooms.
     */
    flippedCollectibleTypes: new DefaultMap<
      FlippedCollectibleIndex,
      CollectibleType,
      [collectible: EntityPickup]
    >((_key: FlippedCollectibleIndex, collectible: EntityPickup) =>
      newFlippedCollectibleType(collectible),
    ),
  },

  room: {
    /**
     * Indexed by collectible `PtrHash` (which is safe to use on per-room data structures).
     * This cannot be on the "level" object because sprites are not serializable.
     */
    flippedSprites: new DefaultMap<
      PtrHash,
      Sprite,
      [flippedCollectibleType: CollectibleType]
    >((_key: PtrHash, flippedCollectibleType: CollectibleType) =>
      newFlippedSprite(flippedCollectibleType),
    ),
  },
};

function newFlippedCollectibleType(collectible: EntityPickup) {
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

function newFlippedSprite(collectibleType: CollectibleType) {
  const sprite = initItemSprite(collectibleType);

  const faded = copyColor(sprite.Color);
  faded.A = FADE_AMOUNT;
  sprite.Color = faded;

  return sprite;
}

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
    const flippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
    const flippedCollectibleType = v.level.flippedCollectibleTypes.get(
      flippedCollectibleIndex,
    );

    // Do not convert items back to an empty pedestal
    // (this matches the behavior of the vanilla Flip)
    if (
      flippedCollectibleType === undefined ||
      flippedCollectibleType === CollectibleType.COLLECTIBLE_NULL
    ) {
      continue;
    }

    // Flip the items
    const oldCollectibleType = collectible.SubType;
    setCollectibleSubType(collectible, flippedCollectibleType);
    v.level.flippedCollectibleTypes.set(
      flippedCollectibleIndex,
      oldCollectibleType,
    );

    // Delete the flipped sprite
    const ptrHash = GetPtrHash(collectible);
    v.room.flippedSprites.delete(ptrHash);
    // (the sprite will be reinitialized on the next render frame if there is still an item in the
    // alternate world)

    // Copy the vanilla poof animation
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.POOF01,
      PoofSubType.NORMAL,
      collectible.Position,
      Vector.Zero,
      undefined,
    );
  }

  // We also need to invoke the real Flip effect if we are Tainted Lazarus or Dead Tainted Lazarus
  if (isTaintedLazarus(player)) {
    useActiveItemTemp(player, CollectibleType.COLLECTIBLE_FLIP);
  }

  // Display the "Use" animation
  return true;
}

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!config.flipCustom) {
    return;
  }

  // Automatically replace the vanilla flip with the custom one
  // (this handles Tainted Lazarus correctly, since he is given Flip in the normal active item slot)
  if (player.HasCollectible(OLD_COLLECTIBLE_TYPE)) {
    player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
    removeCollectibleFromItemTracker(OLD_COLLECTIBLE_TYPE);
    const charges = getCollectibleMaxCharges(NEW_COLLECTIBLE_TYPE);
    player.AddCollectible(NEW_COLLECTIBLE_TYPE, charges, false);
  }
}

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupInitCollectible(collectible: EntityPickup): void {
  if (!config.flipCustom) {
    return;
  }

  if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  const flippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
  v.level.flippedCollectibleTypes.getAndSetDefault(
    flippedCollectibleIndex,
    collectible,
  );
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

  if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  const flippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
  const flippedCollectibleType = v.level.flippedCollectibleTypes.get(
    flippedCollectibleIndex,
  );
  if (
    flippedCollectibleType === undefined ||
    flippedCollectibleType === CollectibleType.COLLECTIBLE_NULL
  ) {
    return;
  }

  const ptrHash = GetPtrHash(collectible);
  const flippedSprite = v.room.flippedSprites.getAndSetDefault(
    ptrHash,
    flippedCollectibleType,
  );
  const pickupRenderPosition = Isaac.WorldToRenderPosition(
    collectible.Position,
  );
  const renderPosition = pickupRenderPosition
    .add(renderOffset)
    .add(FLIPPED_COLLECTIBLE_DRAW_OFFSET);
  flippedSprite.RenderLayer(COLLECTIBLE_LAYER, renderPosition);
}

// ModCallbacksCustom.MC_POST_PURCHASE
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPurchaseCollectible(
  player: EntityPlayer,
  collectible: EntityPickup,
): void {
  // Normally, when a collectible is purchased, the empty pedestal will despawn on the next frame
  // The vanilla flip has a feature where if you purchase a collectible, it will keep the empty
  // pedestal around (so that you can use Flip on the other item if you want)
  // Emulate this feature with the custom flip
  if (!config.flipCustom) {
    return;
  }

  if (!player.HasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  // Spawn a new empty pedestal, since the purchased collectible will disappear a frame from now
  const emptyCollectible = spawnEmptyCollectible(
    collectible.Position,
    collectible.InitSeed,
  );

  // Transfer the old flipped item to the new empty pedestal
  // (which may or may not be necessary depending on the indexing scheme that we are using)
  const oldFlippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
  const oldFlippedCollectibleType =
    v.level.flippedCollectibleTypes.getAndSetDefault(
      oldFlippedCollectibleIndex,
      collectible,
    );
  const newFlippedCollectibleIndex =
    getFlippedCollectibleIndex(emptyCollectible);
  v.level.flippedCollectibleTypes.set(
    newFlippedCollectibleIndex,
    oldFlippedCollectibleType,
  );
}
