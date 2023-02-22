import {
  CollectibleSpriteLayer,
  CollectibleType,
  DamageFlag,
  ModCallback,
  PickupPrice,
  PickupVariant,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  asNumber,
  Callback,
  CallbackCustom,
  DefaultMap,
  game,
  getHUDOffsetVector,
  inStartingRoom,
  isCharacter,
  isChildPlayer,
  isSelfDamage,
  ModCallbackCustom,
  onDarkRoom,
  wouldDamageTaintedMagdaleneNonTemporaryHeartContainers,
} from "isaacscript-common";
import { PickupPriceCustom } from "../../../enums/PickupPriceCustom";
import { inSeededRaceWithAllAngelRooms } from "../../../features/race/consistentDevilAngelRooms";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import { newCollectibleSprite } from "../../../sprite";
import { getEffectiveDevilDeals } from "../../../utils";
import { Config } from "../../Config";
import { ConfigurableModFeature } from "../../ConfigurableModFeature";

const ICON_SPRITE_POSITION = Vector(42, 51); // To the right of the coin count.
const TAINTED_CHARACTER_UI_OFFSET = Vector(4, 24);
const COLLECTIBLE_OFFSET = Vector(0, 30);

const iconSprite = newMysteryGiftSprite(true);

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
  configKey: keyof Config = "freeDevilItem";
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (!shouldGetFreeDevilItemOnThisRun()) {
      return;
    }

    // In seeded races, we might be guaranteed to be getting Angel Rooms. If so, then showing the
    // free item icon is superfluous.
    if (inSeededRaceWithAllAngelRooms()) {
      return;
    }

    this.drawIconSprite();
  }

  drawIconSprite(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    const hudOffsetVector = getHUDOffsetVector();
    const defaultPosition = ICON_SPRITE_POSITION.add(hudOffsetVector);
    const hasTaintedCharacterUI = anyPlayerIs(
      PlayerType.ISAAC_B, // 21
      PlayerType.BLUE_BABY_B, // 25
    );
    const position = hasTaintedCharacterUI
      ? defaultPosition.add(TAINTED_CHARACTER_UI_OFFSET)
      : defaultPosition;
    iconSprite.RenderLayer(CollectibleSpriteLayer.HEAD, position);
  }

  // 35, 100
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    if (
      shouldGetFreeDevilItemOnThisRun() &&
      this.shouldGetFreeDevilItemInThisRoom() &&
      this.isDevilDealStyleCollectible(collectible)
    ) {
      // Update the price of the item on every frame. We deliberately do not change
      // `AutoUpdatePrice` so that as soon as the player is no longer eligible for the free item,
      // the price will immediately change back to what it is supposed to be.
      collectible.Price = PickupPriceCustom.PRICE_FREE_DEVIL_DEAL;
    }
  }

  shouldGetFreeDevilItemInThisRoom(): boolean {
    const gameFrameCount = game.GetFrameCount();
    const roomType = g.r.GetType();

    return (
      // Black Market deals do not count as "locking in" Devil Deals, so we exclude this mechanic
      // from applying to them.
      roomType !== RoomType.BLACK_MARKET &&
      // Dark Room starting room deals also don't count as "locking in" Devil Deals.
      !(onDarkRoom() && inStartingRoom()) &&
      // We might be traveling to a Devil Room for run-initialization-related tasks.
      gameFrameCount > 0
    );
  }

  /**
   * Detecting a Devil-Deal-style collectible is normally trivial because you can check for if the
   * price is less than 0 and is not `PickupPrice.FREE`. However, this does not work on Keeper,
   * because all Devil-Deal-style collectibles cost money. Furthermore, it does not work on Tainted
   * Keeper, because all collectibles cost money. It also fails with shop items.
   *
   * For simplicity, this function assumes that every collectible in a Devil Room or Black Market
   * Keeper is a Devil-Deal-style collectible for Keeper and Tainted Keeper. This is not necessarily
   * true, as Keeper could use Satanic Bible and get a Devil-Deal-style item in a Boss Room, for
   * example.
   */
  isDevilDealStyleCollectible(collectible: EntityPickupCollectible): boolean {
    const roomType = g.r.GetType();

    if (anyPlayerIs(PlayerType.KEEPER, PlayerType.KEEPER_B)) {
      return (
        collectible.Price > 0 &&
        (roomType === RoomType.DEVIL || roomType === RoomType.BLACK_MARKET)
      );
    }

    // Handle the special case of collectibles with A Pound of Flesh.
    if (anyPlayerHasCollectible(CollectibleType.POUND_OF_FLESH)) {
      // For the context of this function, shop items with A Pound of Flesh do not count as devil
      // deal style collectibles because they do not increase the return value from the
      // `Game.GetDevilRoomDeals` method. (Black Market items are not affected by A Pound of Flesh.)
      if (roomType === RoomType.SHOP) {
        return false;
      }

      if (roomType === RoomType.DEVIL) {
        return collectible.Price > 0;
      }
    }

    return (
      collectible.Price < 0 && collectible.Price !== asNumber(PickupPrice.FREE)
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
    if (!config.freeDevilItem) {
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

export function shouldGetFreeDevilItemOnThisRun(): boolean {
  const effectiveDevilDeals = getEffectiveDevilDeals();
  const anyPlayerIsTheLost = anyPlayerIs(PlayerType.LOST, PlayerType.LOST_B);

  return !v.run.tookDamage && effectiveDevilDeals === 0 && !anyPlayerIsTheLost;
}
