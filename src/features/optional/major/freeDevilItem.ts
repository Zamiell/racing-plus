import {
  anyPlayerIs,
  isChildPlayer,
  isSelfDamage,
  saveDataManager,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "../../../constants";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { initItemSprite } from "../../../sprite";
import { PickupPriceCustom } from "../../../types/PickupPriceCustom";

const ITEM_OFFSET = Vector(0, 30);

const v = {
  run: {
    tookDamage: false,
  },

  room: {
    spriteMap: new Map<PtrHash, Sprite>(),
  },
};

export function init(): void {
  saveDataManager("freeDevilItem", v, featureEnabled);
}

function featureEnabled() {
  return config.freeDevilItem;
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
export function entityTakeDmgPlayer(
  tookDamage: Entity,
  damageFlags: int,
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

  v.run.tookDamage = true;
}

// ModCallbacks.MC_POST_PICKUP_UPDATE (35)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupUpdateCollectible(pickup: EntityPickup) {
  if (!config.freeDevilItem) {
    return;
  }

  if (!shouldGetFreeDevilItem()) {
    return;
  }

  if (isDevilDealStyleCollectible(pickup)) {
    // Update the price of the item on every frame
    // We deliberately do not change "AutoUpdatePrice" so that as soon as the player is no longer
    // eligible for the free item, the price will immediately change back to what it is supposed to
    // be
    pickup.Price = PickupPriceCustom.PRICE_FREE_DEVIL_DEAL;
  }
}

function shouldGetFreeDevilItem() {
  const devilRoomDeals = g.g.GetDevilRoomDeals();
  const gameFrameCount = g.g.GetFrameCount();
  const anyPlayerIsTheLost = anyPlayerIs(
    PlayerType.PLAYER_THELOST,
    PlayerType.PLAYER_THELOST_B,
  );
  const roomType = g.r.GetType();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  return (
    !v.run.tookDamage &&
    devilRoomDeals === 0 &&
    // Black Market deals do not count as "locking in" Devil Deals,
    // so we exclude this mechanic from applying to them
    roomType !== RoomType.ROOM_BLACK_MARKET &&
    // Dark Room starting room deals also don't count as "locking in" Devil Deals
    !(stage === 11 && stageType === 0 && roomType !== RoomType.ROOM_DEVIL) &&
    !anyPlayerIsTheLost &&
    // We might be travelling to a Devil Room for run-initialization-related tasks
    gameFrameCount > 0
  );
}

/**
 * Detecting a Devil-Deal-style collectible is normally trivial because you can check for if the
 * price is less than 0 and is not PickupPrice.PRICE_FREE. However, this does not work on Keeper,
 * because all Devil-Deal-style items cost money. Furthermore, it does not work on Tainted Keeper,
 * because all items cost money.
 *
 * For simplicity, this function assumes that every item in a Devil Room or Black Market Keeper is
 * a Devil-Deal-style item for Keeper and Tainted Keeper. This is not necessarily true, as Keeper
 * could use Satanic Bible and get a Devil-Deal-style item in a Boss Room, for example.
 */
function isDevilDealStyleCollectible(pickup: EntityPickup) {
  const roomType = g.r.GetType();

  if (anyPlayerIs(PlayerType.PLAYER_KEEPER, PlayerType.PLAYER_KEEPER_B)) {
    return (
      pickup.Price > 0 &&
      (roomType === RoomType.ROOM_DEVIL ||
        roomType === RoomType.ROOM_BLACK_MARKET)
    );
  }

  return pickup.Price < 0 && pickup.Price !== PickupPrice.PRICE_FREE;
}

// ModCallbacks.MC_POST_PICKUP_RENDER (36)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupRenderCollectible(
  pickup: EntityPickup,
  renderOffset: Vector,
) {
  if (!config.freeDevilItem) {
    return;
  }

  if (pickup.Price !== PickupPriceCustom.PRICE_FREE_DEVIL_DEAL) {
    return;
  }

  const ptrHash = GetPtrHash(pickup);
  let sprite = v.room.spriteMap.get(ptrHash);
  if (sprite === undefined) {
    sprite = initItemSprite(CollectibleType.COLLECTIBLE_MYSTERY_GIFT);
    sprite.Scale = Vector(0.666, 0.666);

    v.room.spriteMap.set(ptrHash, sprite);
  }

  const worldPosition = Isaac.WorldToRenderPosition(pickup.Position);
  const position = worldPosition.add(renderOffset).add(ITEM_OFFSET);
  sprite.RenderLayer(COLLECTIBLE_LAYER, position);
}
