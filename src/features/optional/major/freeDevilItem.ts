import {
  CollectibleType,
  DamageFlag,
  PickupPrice,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  asNumber,
  DefaultMap,
  game,
  getTaintedMagdaleneNonTemporaryMaxHearts,
  inStartingRoom,
  isCharacter,
  isChildPlayer,
  isSelfDamage,
  onDarkRoom,
  saveDataManager,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "../../../constants";
import { PickupPriceCustom } from "../../../enums/PickupPriceCustom";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { initCollectibleSprite } from "../../../sprite";
import { getEffectiveDevilDeals } from "../../../utilsGlobals";
import { inSeededRaceWithAllAngelRooms } from "../../race/consistentDevilAngelRooms";

const ICON_SPRITE_POSITION = Vector(42, 51); // To the right of the coin count
const TAINTED_CHARACTER_UI_OFFSET = Vector(4, 24);
const COLLECTIBLE_OFFSET = Vector(0, 30);

const iconSprite = newMysteryGiftSprite();
iconSprite.Scale = Vector(0.5, 0.5);

const v = {
  run: {
    tookDamage: false,
  },

  room: {
    spriteMap: new DefaultMap<PtrHash, Sprite>(() => newMysteryGiftSprite()),
  },
};

function newMysteryGiftSprite() {
  const sprite = initCollectibleSprite(CollectibleType.MYSTERY_GIFT);
  sprite.Scale = Vector(0.666, 0.666);

  return sprite;
}

export function init(): void {
  saveDataManager("freeDevilItem", v, featureEnabled);
}

function featureEnabled() {
  return config.freeDevilItem;
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.freeDevilItem) {
    return;
  }

  if (!shouldGetFreeDevilItemOnThisRun()) {
    return;
  }

  // In seeded races, we might be guaranteed to be getting Angel Rooms. If so, then showing the free
  // item icon is superfluous.
  if (inSeededRaceWithAllAngelRooms()) {
    return;
  }

  drawIconSprite();
}

function drawIconSprite() {
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  const hasTaintedCharacterUI = anyPlayerIs(
    PlayerType.ISAAC_B, // 21
    PlayerType.BLUE_BABY_B, // 25
  );
  const position = hasTaintedCharacterUI
    ? ICON_SPRITE_POSITION.add(TAINTED_CHARACTER_UI_OFFSET)
    : ICON_SPRITE_POSITION;
  iconSprite.RenderLayer(COLLECTIBLE_LAYER, position);
}

// ModCallback.ENTITY_TAKE_DMG (11)
export function entityTakeDmgPlayer(
  tookDamage: Entity,
  damageAmount: float,
  damageFlags: BitFlags<DamageFlag>,
): void {
  if (!config.freeDevilItem) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (player === undefined) {
    return;
  }

  if (isChildPlayer(player)) {
    return;
  }

  if (isSelfDamage(damageFlags)) {
    return;
  }

  // As an exception, Tainted Magdalene is allowed to get damaged on her temporary heart containers.
  if (isCharacter(player, PlayerType.MAGDALENE_B)) {
    if (
      wouldDamageTaintedMagdaleneNonTemporaryHeartContainers(
        player,
        damageAmount,
      )
    ) {
      v.run.tookDamage = true;
    }

    return;
  }

  v.run.tookDamage = true;
}

function wouldDamageTaintedMagdaleneNonTemporaryHeartContainers(
  player: EntityPlayer,
  damageAmount: float,
) {
  // Regardless of the damage amount, damage to a player cannot remove a soul heart and a red heart
  // at the same time.
  const soulHearts = player.GetSoulHearts();
  if (soulHearts > 0) {
    return false;
  }

  // Regardless of the damage amount, damage to a player cannot remove a bone heart and a red heart
  // at the same time.
  const boneHearts = player.GetBoneHearts();
  if (boneHearts > 0) {
    return false;
  }

  // Account for rotten hearts eating away at more red hearts than usual.
  const hearts = player.GetHearts();
  const rottenHearts = player.GetRottenHearts();
  const effectiveDamageAmount =
    damageAmount + Math.min(rottenHearts, damageAmount);

  const heartsAfterDamage = hearts - effectiveDamageAmount;
  const nonTemporaryMaxHearts =
    getTaintedMagdaleneNonTemporaryMaxHearts(player);
  return heartsAfterDamage < nonTemporaryMaxHearts;
}

// ModCallback.POST_PICKUP_UPDATE (35)
// PickupVariant.COLLECTIBLE (100)
export function postPickupUpdateCollectible(
  collectible: EntityPickupCollectible,
): void {
  if (!config.freeDevilItem) {
    return;
  }

  if (
    shouldGetFreeDevilItemOnThisRun() &&
    shouldGetFreeDevilItemInThisRoom() &&
    isDevilDealStyleCollectible(collectible)
  ) {
    // Update the price of the item on every frame. We deliberately do not change `AutoUpdatePrice`
    // so that as soon as the player is no longer eligible for the free item, the price will
    // immediately change back to what it is supposed to be.
    collectible.Price = PickupPriceCustom.PRICE_FREE_DEVIL_DEAL;
  }
}

export function shouldGetFreeDevilItemOnThisRun(): boolean {
  const effectiveDevilDeals = getEffectiveDevilDeals();
  const anyPlayerIsTheLost = anyPlayerIs(
    PlayerType.THE_LOST,
    PlayerType.THE_LOST_B,
  );

  return !v.run.tookDamage && effectiveDevilDeals === 0 && !anyPlayerIsTheLost;
}

function shouldGetFreeDevilItemInThisRoom() {
  const gameFrameCount = game.GetFrameCount();
  const roomType = g.r.GetType();

  return (
    // Black Market deals do not count as "locking in" Devil Deals, so we exclude this mechanic from
    // applying to them.
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
 * Keeper, because all collectibles cost money. It also fails with shop items
 *
 * For simplicity, this function assumes that every collectible in a Devil Room or Black Market
 * Keeper is a Devil-Deal-style collectible for Keeper and Tainted Keeper. This is not necessarily
 * true, as Keeper could use Satanic Bible and get a Devil-Deal-style item in a Boss Room, for
 * example.
 */
function isDevilDealStyleCollectible(collectible: EntityPickupCollectible) {
  const roomType = g.r.GetType();

  if (anyPlayerIs(PlayerType.KEEPER, PlayerType.KEEPER_B)) {
    return (
      collectible.Price > 0 &&
      (roomType === RoomType.DEVIL || roomType === RoomType.BLACK_MARKET)
    );
  }

  // Handle the special case of collectibles with A Pound of Flesh.
  if (anyPlayerHasCollectible(CollectibleType.POUND_OF_FLESH)) {
    // For the context of this function, shop items with A Pound of Flesh do not count as devil deal
    // style collectibles because they do not increase the return value from the
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

// ModCallback.POST_PICKUP_RENDER (36)
// PickupVariant.COLLECTIBLE (100)
export function postPickupRenderCollectible(
  pickup: EntityPickup,
  renderOffset: Vector,
): void {
  if (!config.freeDevilItem) {
    return;
  }

  if (pickup.Price !== asNumber(PickupPriceCustom.PRICE_FREE_DEVIL_DEAL)) {
    return;
  }

  const ptrHash = GetPtrHash(pickup);
  const sprite = v.room.spriteMap.getAndSetDefault(ptrHash);
  const worldPosition = Isaac.WorldToRenderPosition(pickup.Position);
  const position = worldPosition.add(renderOffset).add(COLLECTIBLE_OFFSET);
  sprite.RenderLayer(COLLECTIBLE_LAYER, position);
}
