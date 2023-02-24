import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { PickupVariantCustom } from "../enums/PickupVariantCustom";
import * as seededGBBug from "../features/mandatory/seededGBBug";
import * as scaredHeart from "../features/optional/graphics/scaredHeart";
import * as stickyNickel from "../features/optional/graphics/stickyNickel";
import * as uniqueCardBacks from "../features/optional/graphics/uniqueCardBacks";
import { betterDevilAngelRoomsPostPickupInitRedChest } from "../features/optional/major/betterDevilAngelRooms/callbacks/postPickupInit";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";
import { automaticItemInsertionPostPickupInit } from "../features/optional/quality/automaticItemInsertion/callbacks/postPickupInit";
import * as removePerfectionVelocity from "../features/optional/quality/removePerfectionVelocity";
import * as speedrunPostPickupInit from "../features/speedrun/callbacks/postPickupInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PICKUP_INIT, main);

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    heartCallback,
    PickupVariant.HEART, // 10
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    coinCallback,
    PickupVariant.COIN, // 20
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    tarotCard,
    PickupVariant.TAROT_CARD, // 300
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    bigChest,
    PickupVariant.BIG_CHEST, // 340
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    trinketCallback,
    PickupVariant.TRINKET, // 350
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    redChest,
    PickupVariant.RED_CHEST, // 360
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    trophy,
    PickupVariant.TROPHY, // 370
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    invisiblePickup,
    PickupVariantCustom.INVISIBLE_PICKUP,
  );
}

function main(pickup: EntityPickup) {
  seededGBBug.postPickupInit(pickup);
  automaticItemInsertionPostPickupInit(pickup);
}

// PickupVariant.HEART (10)
function heartCallback(pickup: EntityPickup) {
  const heart = pickup as EntityPickupHeart;

  scaredHeart.postPickupInitHeart(heart);
}

// PickupVariant.COIN (20)
function coinCallback(pickup: EntityPickup) {
  const coin = pickup as EntityPickupCoin;

  stickyNickel.postPickupInitCoin(coin);
}

// PickupVariant.TAROT_CARD (300)
function tarotCard(pickup: EntityPickup) {
  const pickupCard = pickup as EntityPickupCard;

  uniqueCardBacks.postPickupInitTarotCard(pickupCard);
}

// PickupVariant.BIG_CHEST (340)
function bigChest(pickup: EntityPickup) {
  fastTravelPostPickupInit.bigChest(pickup);
}

// PickupVariant.TRINKET (350)
function trinketCallback(pickup: EntityPickup) {
  const trinket = pickup as EntityPickupTrinket;

  removePerfectionVelocity.postPickupInitTrinket(trinket);
}

// PickupVariant.RED_CHEST (360)
function redChest(_pickup: EntityPickup) {
  betterDevilAngelRoomsPostPickupInitRedChest();
}

// PickupVariant.TROPHY (370)
function trophy(pickup: EntityPickup) {
  speedrunPostPickupInit.trophy(pickup);
}

// PickupVariantCustom.INVISIBLE_PICKUP
function invisiblePickup(pickup: EntityPickup) {
  pickup.Remove();
}
