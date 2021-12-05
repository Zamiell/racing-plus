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
import { PickupPriceCustom } from "../../../types/enums";

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

  if (pickup.Price !== 0) {
    // Update the price of the item on every frame
    // We deliberately do not change "AutoUpdatePrice" so that as soon as the free item is no longer
    // eligible, the price will immediately change
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

  return (
    !v.run.tookDamage &&
    devilRoomDeals === 0 &&
    !anyPlayerIsTheLost &&
    // We might be travelling to a Devil Room for run-initialization-related tasks
    gameFrameCount > 0
  );
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
