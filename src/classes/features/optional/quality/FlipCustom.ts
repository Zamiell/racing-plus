import {
  CollectibleSpriteLayer,
  CollectibleType,
  EffectVariant,
  ModCallback,
  PickupVariant,
  PoofSubType,
  RenderMode,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  Callback,
  CallbackCustom,
  DefaultMap,
  game,
  getCollectibleMaxCharges,
  getCollectibles,
  getRoomListIndex,
  inDeathCertificateArea,
  isBlindCollectible,
  isTaintedLazarus,
  ModCallbackCustom,
  setCollectibleSubType,
  setSpriteOpacity,
  spawnEffect,
  spawnEmptyCollectible,
  useActiveItemTemp,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { mod } from "../../../../mod";
import { newCollectibleSprite } from "../../../../sprite";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../gameplay/extraStartingItems/constants";

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
  const room = game.GetRoom();
  const gridIndex = room.GetGridIndex(collectible.Position);

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

function newFlippedSprite(
  flippedCollectibleType: CollectibleType,
  nonFlippedCollectible: EntityPickup,
) {
  const collectibleTypeToUse = isBlindCollectible(nonFlippedCollectible)
    ? INVALID_COLLECTIBLE_TYPE
    : flippedCollectibleType;
  const sprite = newCollectibleSprite(collectibleTypeToUse);

  setSpriteOpacity(sprite, FADE_AMOUNT);

  return sprite;
}

function newFlippedCollectibleType(collectible: EntityPickup): CollectibleType {
  const itemPool = game.GetItemPool();
  const itemPoolType = mod.getCollectibleItemPoolType(collectible);
  const collectibleType = itemPool.GetCollectible(
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

export class FlipCustom extends ConfigurableModFeature {
  configKey: keyof Config = "FlipCustom";
  v = v;

  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleTypeCustom.FLIP_CUSTOM)
  postUseItemFlipCustom(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
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
      spawnEffect(
        EffectVariant.POOF_1,
        PoofSubType.NORMAL,
        collectible.Position,
      );
    }

    // We also need to invoke the real Flip effect if we are Tainted Lazarus or Dead Tainted
    // Lazarus.
    if (isTaintedLazarus(player)) {
      useActiveItemTemp(player, CollectibleType.FLIP);
    }

    // Display the "Use" animation.
    return true;
  }

  // 34, 100
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
      return;
    }

    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();
    const roomFrameCount = room.GetFrameCount();

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
    const flippedCollectibleIndex = getFlippedCollectibleIndex(pickup);
    if (v.level.flippedCollectibleTypes.has(flippedCollectibleIndex)) {
      return;
    }

    // Handle the special case of a temporary item being spawned in a Devil Room / Angel Room. In
    // this case, we do not have to assign a new flipped collectible, since the item will be
    // respawned later on this frame.
    const flippedCollectibleType = newFlippedCollectibleType(pickup);
    if (flippedCollectibleType === CollectibleTypeCustom.DEBUG) {
      return;
    }

    v.level.flippedCollectibleTypes.set(
      flippedCollectibleIndex,
      flippedCollectibleType,
    );
  }

  // 36, 100
  @Callback(ModCallback.POST_PICKUP_RENDER, PickupVariant.COLLECTIBLE)
  postPickupRenderCollectible(
    pickup: EntityPickup,
    renderOffset: Vector,
  ): void {
    if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
      return;
    }

    const room = game.GetRoom();

    // Checking for blind sprites will not work in the reflect callback, so wait for the "normal"
    // render callback to fire.
    const renderMode = room.GetRenderMode();
    if (renderMode === RenderMode.WATER_REFLECT) {
      return;
    }

    const flippedCollectibleIndex = getFlippedCollectibleIndex(pickup);
    const flippedCollectibleType = v.level.flippedCollectibleTypes.get(
      flippedCollectibleIndex,
    );
    if (
      flippedCollectibleType === undefined ||
      flippedCollectibleType === CollectibleType.NULL
    ) {
      return;
    }

    const ptrHash = GetPtrHash(pickup);
    const flippedSprite = v.room.flippedSprites.getAndSetDefault(
      ptrHash,
      flippedCollectibleType,
      pickup,
    );
    const pickupRenderPosition = Isaac.WorldToScreen(pickup.Position);
    const renderPosition = pickupRenderPosition
      .add(renderOffset)
      .add(FLIPPED_COLLECTIBLE_DRAW_OFFSET);
    flippedSprite.RenderLayer(CollectibleSpriteLayer.HEAD, renderPosition);
  }

  /**
   * Automatically replace the vanilla flip with the custom one. (This handles Tainted Lazarus
   * correctly, since he is given Flip in the normal active item slot.)
   */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (player.HasCollectible(OLD_COLLECTIBLE_TYPE, true)) {
      player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
      const charges = getCollectibleMaxCharges(NEW_COLLECTIBLE_TYPE);
      player.AddCollectible(NEW_COLLECTIBLE_TYPE, charges, false);
    }
  }

  /**
   * Normally, when a collectible is purchased, the empty pedestal will despawn on the next frame.
   * The vanilla flip has a feature where if you purchase a collectible, it will keep the empty
   * pedestal around (so that you can use Flip on the other item if you want). Emulate this feature
   * with the custom flip.
   */
  @CallbackCustom(ModCallbackCustom.POST_PURCHASE, PickupVariant.COLLECTIBLE)
  postPurchaseCollectible(
    player: EntityPlayer,
    collectible: EntityPickup,
  ): void {
    if (!player.HasCollectible(NEW_COLLECTIBLE_TYPE)) {
      return;
    }

    // Spawn a new empty pedestal, since the purchased collectible will disappear a frame from now.
    spawnEmptyCollectible(collectible.Position, collectible.InitSeed);

    // We do not have to transfer the entry in the `flippedCollectibleTypes` map to the new
    // pedestal, because it will have the same room list index and grid index.
  }
}
