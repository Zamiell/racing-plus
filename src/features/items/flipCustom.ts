import {
  CollectibleType,
  EffectVariant,
  PoofSubType,
  RenderMode,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  copyColor,
  DefaultMap,
  getCollectibleMaxCharges,
  getCollectibles,
  getRoomListIndex,
  inDeathCertificateArea,
  isBlindCollectible,
  isTaintedLazarus,
  setCollectibleSubType,
  spawnEffect,
  spawnEmptyCollectible,
  useActiveItemTemp,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "../../constants";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { g } from "../../globals";
import { mod } from "../../mod";
import { config } from "../../modConfigMenu";
import { newCollectibleSprite } from "../../sprite";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../optional/gameplay/extraStartingItems/constants";

const OLD_COLLECTIBLE_TYPE = CollectibleType.FLIP;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.FLIP_CUSTOM;
const FADE_AMOUNT = 0.35;
const FLIPPED_COLLECTIBLE_DRAW_OFFSET = Vector(-15, -15);

/**
 * An intentionally invalid collectible type. This will result in the `getCollectibleGfxFilename`
 * function returning the path to the question mark PNG file.
 */
const INVALID_COLLECTIBLE_TYPE = -1;

/** See the documentation for the `flippedCollectibleTypes` map. */
type FlippedCollectibleIndex = string & {
  __flippedCollectibleIndexBrand: unknown;
};

/** See the documentation for `v.level.flippedCollectibleTypes`. */
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
     * - We can't use `InitSeed`, since that changes after a reroll.
     * - We can't use `CollectibleIndex`, since that changes after a reroll.
     * - We can't use `PtrHash`, since that is no longer valid once you leave the room.
     * - We ignore the edge-case of the flipped collectible type persisting to a post-Ascent
     *   Treasure Room.
     */
    flippedCollectibleTypes: new Map<
      FlippedCollectibleIndex,
      CollectibleType
    >(),
  },

  room: {
    /**
     * Indexed by collectible `PtrHash` (which is safe to use on per-room data structures). This
     * cannot be on the "level" object because sprites are not serializable.
     */
    flippedSprites: new DefaultMap<
      PtrHash,
      Sprite,
      [
        flippedCollectibleType: CollectibleType,
        nonFlippedCollectible: EntityPickup,
      ]
    >(
      (
        flippedCollectibleType: CollectibleType,
        nonFlippedCollectible: EntityPickup,
      ) => newFlippedSprite(flippedCollectibleType, nonFlippedCollectible),
    ),
  },
};

function newFlippedCollectibleType(collectible: EntityPickup): CollectibleType {
  const itemPoolType = mod.getCollectibleItemPoolType(collectible);
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

function newFlippedSprite(
  flippedCollectibleType: CollectibleType,
  nonFlippedCollectible: EntityPickup,
) {
  const collectibleTypeToUse = isBlindCollectible(nonFlippedCollectible)
    ? INVALID_COLLECTIBLE_TYPE
    : flippedCollectibleType;
  const sprite = newCollectibleSprite(collectibleTypeToUse);

  const faded = copyColor(sprite.Color);
  faded.A = FADE_AMOUNT;
  sprite.Color = faded;

  return sprite;
}

export function init(): void {
  mod.saveDataManager("flipCustom", v, featureEnabled);
}

function featureEnabled() {
  return config.flipCustom;
}

// ModCallback.POST_USE_ITEM (3)
// CollectibleTypeCustom.FLIP_CUSTOM
export function postUseItemFlipCustom(
  player: EntityPlayer,
): boolean | undefined {
  if (!config.flipCustom) {
    return undefined;
  }

  for (const collectible of getCollectibles()) {
    const flippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
    const flippedCollectibleType = v.level.flippedCollectibleTypes.get(
      flippedCollectibleIndex,
    );

    // Do not convert collectibles back to an empty pedestal. (This matches the behavior of the
    // vanilla Flip.)
    if (
      flippedCollectibleType === undefined ||
      flippedCollectibleType === CollectibleType.NULL
    ) {
      continue;
    }

    // Flip the items.
    const oldCollectibleType = collectible.SubType;
    setCollectibleSubType(collectible, flippedCollectibleType);
    v.level.flippedCollectibleTypes.set(
      flippedCollectibleIndex,
      oldCollectibleType,
    );

    // Delete the flipped sprite.
    const ptrHash = GetPtrHash(collectible);
    v.room.flippedSprites.delete(ptrHash);
    // (The sprite will be reinitialized on the next render frame if there is still an item in the
    // alternate world.)

    // Copy the vanilla poof animation.
    spawnEffect(EffectVariant.POOF_1, PoofSubType.NORMAL, collectible.Position);
  }

  // We also need to invoke the real Flip effect if we are Tainted Lazarus or Dead Tainted Lazarus.
  if (isTaintedLazarus(player)) {
    useActiveItemTemp(player, CollectibleType.FLIP);
  }

  // Display the "Use" animation.
  return true;
}

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!config.flipCustom) {
    return;
  }

  // Automatically replace the vanilla flip with the custom one. (This handles Tainted Lazarus
  // correctly, since he is given Flip in the normal active item slot.)
  if (player.HasCollectible(OLD_COLLECTIBLE_TYPE, true)) {
    player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
    const charges = getCollectibleMaxCharges(NEW_COLLECTIBLE_TYPE);
    player.AddCollectible(NEW_COLLECTIBLE_TYPE, charges, false);
  }
}

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.COLLECTIBLE (100)
export function postPickupInitCollectible(
  collectible: EntityPickupCollectible,
): void {
  if (!config.flipCustom) {
    return;
  }

  if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  const isFirstVisit = g.r.IsFirstVisit();
  const roomFrameCount = g.r.GetFrameCount();

  // The Flip effect is only supposed to happen to items that are part of the room layout.
  if (!isFirstVisit || roomFrameCount > 0) {
    return;
  }

  // Flip does not apply in the Death Certificate area, since there is already one of each
  // collectible.
  if (inDeathCertificateArea()) {
    return;
  }

  // If the collectible is rolled, the `POST_PICKUP_INIT` callback will fire again, but we do not
  // want to get a new flipped collectible type in this case. Thus, we only set a new collectible
  // type if the index does not exist already.
  const flippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
  if (v.level.flippedCollectibleTypes.has(flippedCollectibleIndex)) {
    return;
  }

  // Handle the special case of a temporary item being spawned in a Devil Room / Angel Room. In this
  // case, we do not have to assign a new flipped collectible, since the item will be respawned
  // later on this frame.
  const flippedCollectibleType = newFlippedCollectibleType(collectible);
  if (flippedCollectibleType === CollectibleTypeCustom.DEBUG) {
    return;
  }

  v.level.flippedCollectibleTypes.set(
    flippedCollectibleIndex,
    flippedCollectibleType,
  );
}

// ModCallback.POST_PICKUP_RENDER (36)
// PickupVariant.COLLECTIBLE (100)
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

  // Checking for blind sprites will not work in the reflect callback, so wait for the "normal"
  // render callback to fire.
  const renderMode = g.r.GetRenderMode();
  if (renderMode === RenderMode.WATER_REFLECT) {
    return;
  }

  const flippedCollectibleIndex = getFlippedCollectibleIndex(collectible);
  const flippedCollectibleType = v.level.flippedCollectibleTypes.get(
    flippedCollectibleIndex,
  );
  if (
    flippedCollectibleType === undefined ||
    flippedCollectibleType === CollectibleType.NULL
  ) {
    return;
  }

  const ptrHash = GetPtrHash(collectible);
  const flippedSprite = v.room.flippedSprites.getAndSetDefault(
    ptrHash,
    flippedCollectibleType,
    collectible,
  );
  const pickupRenderPosition = Isaac.WorldToRenderPosition(
    collectible.Position,
  );
  const renderPosition = pickupRenderPosition
    .add(renderOffset)
    .add(FLIPPED_COLLECTIBLE_DRAW_OFFSET);
  flippedSprite.RenderLayer(COLLECTIBLE_LAYER, renderPosition);
}

// ModCallbackCustom.POST_PURCHASE
// PickupVariant.COLLECTIBLE (100)
export function postPurchaseCollectible(
  player: EntityPlayer,
  collectible: EntityPickup,
): void {
  // Normally, when a collectible is purchased, the empty pedestal will despawn on the next frame.
  // The vanilla flip has a feature where if you purchase a collectible, it will keep the empty
  // pedestal around (so that you can use Flip on the other item if you want). Emulate this feature
  // with the custom flip.
  if (!config.flipCustom) {
    return;
  }

  if (!player.HasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  // Spawn a new empty pedestal, since the purchased collectible will disappear a frame from now.
  spawnEmptyCollectible(collectible.Position, collectible.InitSeed);

  // We do not have to transfer the entry in the `flippedCollectibleTypes` map to the new pedestal,
  // because it will have the same room list index and grid index.
}
