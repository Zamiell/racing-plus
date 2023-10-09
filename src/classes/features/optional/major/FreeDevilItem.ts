import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CollectibleSpriteLayer,
  CollectibleType,
  ItemPoolType,
  ModCallback,
  PickupPrice,
  PickupVariant,
  PlayerType,
  RoomType,
  SeedEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DefaultMap,
  ModCallbackCustom,
  VectorZero,
  anyPlayerIs,
  asNumber,
  game,
  getHUDOffsetVector,
  inRoomType,
  inStartingRoom,
  isAfterGameFrame,
  isCharacter,
  isChildPlayer,
  isSelfDamage,
  newCollectibleSprite,
  onDarkRoom,
  wouldDamageTaintedMagdaleneNonTemporaryHeartContainers,
} from "isaacscript-common";
import { PickupPriceCustom } from "../../../../enums/PickupPriceCustom";
import { inSeededRaceWithAllAngelRooms } from "../../../../features/race/consistentDevilAngelRooms";
import { mod } from "../../../../mod";
import { config } from "../../../../modConfigMenu";
import { getEffectiveDevilDeals } from "../../../../utils";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const TOP_LEFT_UI_POSITION = Vector(42, 51); // To the right of the coin count.
const TAINTED_CHARACTER_UI_OFFSET = Vector(4, 24);
export const ANOTHER_UI_ICON_OFFSET = Vector(16, 0);

const COLLECTIBLE_OFFSET = Vector(0, 30);
const ICON_SPRITE = newMysteryGiftSprite(true);

const v = {
  run: {
    tookDamage: false,
  },

  room: {
    spriteMap: new DefaultMap<PtrHash, Sprite>(() =>
      newMysteryGiftSprite(false),
    ),
  },
};

function newMysteryGiftSprite(icon: boolean) {
  const sprite = newCollectibleSprite(CollectibleType.MYSTERY_GIFT);
  sprite.Scale = icon ? Vector(0.5, 0.5) : Vector(0.666, 0.666);

  return sprite;
}

export class FreeDevilItem extends ConfigurableModFeature {
  configKey: keyof Config = "FreeDevilItem";
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // In seeded races, we might be guaranteed to be getting Angel Rooms. If so, then showing the
    // free item icon is superfluous.
    if (inSeededRaceWithAllAngelRooms()) {
      return;
    }

    if (shouldGetFreeDevilItemOnThisRun()) {
      this.drawIconSprite();
    }
  }

  /** Draw the Mystery Gift icon that indicates that the player currently has a free devil deal. */
  drawIconSprite(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // The `HUD.IsVisible` method does not take into account `SeedEffect.NO_HUD`.
    const seeds = game.GetSeeds();
    if (seeds.HasSeedEffect(SeedEffect.NO_HUD)) {
      return;
    }

    const position = getTopLeftUIPositionFreeDevilItem();
    ICON_SPRITE.RenderLayer(CollectibleSpriteLayer.HEAD, position);
  }

  // 35, 100
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    if (
      shouldGetFreeDevilItemOnThisRun() &&
      this.shouldGetFreeDevilItemInThisRoom() &&
      this.isPricedDevilRoomPoolCollectible(collectible)
    ) {
      // Update the price of the item on every frame. We deliberately do not change
      // `AutoUpdatePrice` so that as soon as the player is no longer eligible for the free item,
      // the price will immediately change back to what it is supposed to be.
      collectible.Price = PickupPriceCustom.PRICE_FREE_DEVIL_DEAL;
      Isaac.DebugString("GETTING HERE");
    }
  }

  shouldGetFreeDevilItemInThisRoom(): boolean {
    return (
      // Black Market deals do not count as "locking in" Devil Deals, so we exclude this mechanic
      // from applying to them.
      !inRoomType(RoomType.BLACK_MARKET) &&
      // Dark Room starting room deals also don't count as "locking in" Devil Deals.
      !(onDarkRoom() && inStartingRoom()) &&
      // We might be traveling to a Devil Room for run-initialization-related tasks.
      isAfterGameFrame(0)
    );
  }

  /**
   * Detecting a priced Devil-Deal-style collectible is normally trivial because you can check for
   * if the price is less than 0 and is not `PickupPrice.YOUR_SOUL` or `PickupPrice.FREE`. However,
   * this does not work on Keeper, because all Devil-Deal-style collectibles cost money.
   * Furthermore, this does not work on Tainted Keeper, because all collectibles cost money. It also
   * fails with the Keeper's Bargain trinket for the same reason.
   */
  isPricedDevilRoomPoolCollectible(
    collectible: EntityPickupCollectible,
  ): boolean {
    const itemPoolType = mod.getCollectibleItemPoolType(collectible);

    return (
      itemPoolType === ItemPoolType.DEVIL &&
      collectible.Price !== PickupPrice.NULL &&
      collectible.Price !== PickupPrice.FREE
    );
  }

  // 36, 100
  @Callback(ModCallback.POST_PICKUP_RENDER, PickupVariant.COLLECTIBLE)
  postPickupRenderCollectible(
    pickup: EntityPickup,
    renderOffset: Vector,
  ): void {
    if (pickup.Price !== asNumber(PickupPriceCustom.PRICE_FREE_DEVIL_DEAL)) {
      return;
    }

    const ptrHash = GetPtrHash(pickup);
    const sprite = v.room.spriteMap.getAndSetDefault(ptrHash);
    const worldPosition = Isaac.WorldToScreen(pickup.Position);
    const position = worldPosition.add(renderOffset).add(COLLECTIBLE_OFFSET);
    sprite.RenderLayer(CollectibleSpriteLayer.HEAD, position);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
  ): boolean | undefined {
    if (!config.FreeDevilItem) {
      return undefined;
    }

    if (isChildPlayer(player)) {
      return undefined;
    }

    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    // As an exception, Tainted Magdalene is allowed to get damaged on her temporary heart
    // containers.
    if (isCharacter(player, PlayerType.MAGDALENE_B)) {
      if (
        wouldDamageTaintedMagdaleneNonTemporaryHeartContainers(player, amount)
      ) {
        v.run.tookDamage = true;
      }

      return undefined;
    }

    v.run.tookDamage = true;
    return undefined;
  }
}

export function getTopLeftUIPositionFreeDevilItem(): Vector {
  const hudOffsetVector = getHUDOffsetVector();

  const hasTaintedCharacterUI = anyPlayerIs(
    PlayerType.ISAAC_B, // 21
    PlayerType.BLUE_BABY_B, // 25
  );
  const taintedCharacterUIOffset = hasTaintedCharacterUI
    ? TAINTED_CHARACTER_UI_OFFSET
    : VectorZero;

  return TOP_LEFT_UI_POSITION.add(hudOffsetVector).add(
    taintedCharacterUIOffset,
  );
}

export function shouldGetFreeDevilItemOnThisRun(): boolean {
  const effectiveDevilDeals = getEffectiveDevilDeals();
  const anyPlayerIsTheLost = anyPlayerIs(PlayerType.LOST, PlayerType.LOST_B);

  return (
    config.FreeDevilItem &&
    !v.run.tookDamage &&
    effectiveDevilDeals === 0 &&
    !anyPlayerIsTheLost
  );
}
