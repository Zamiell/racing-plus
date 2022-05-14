import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { PickupVariantCustom } from "../enums/PickupVariantCustom";
import * as flipCustom from "../features/items/flipCustom";
import * as seededGBBug from "../features/mandatory/seededGBBug";
import * as fastAngels from "../features/optional/bosses/fastAngels";
import * as fastKrampus from "../features/optional/bosses/fastKrampus";
import * as flyItemSprites from "../features/optional/graphics/flyItemSprites";
import * as scaredHeart from "../features/optional/graphics/scaredHeart";
import * as starOfBethlehem from "../features/optional/graphics/starOfBethlehem";
import * as stickyNickel from "../features/optional/graphics/stickyNickel";
import * as twentyTwenty from "../features/optional/graphics/twentyTwenty";
import * as uniqueCardBacks from "../features/optional/graphics/uniqueCardBacks";
import { betterDevilAngelRoomsPostPickupInitRedChest } from "../features/optional/major/betterDevilAngelRooms/callbacks/postPickupInit";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";
import { automaticItemInsertionPostPickupInit } from "../features/optional/quality/automaticItemInsertion/callbacks/postPickupInit";
import * as removePerfectionOnEndFloors from "../features/optional/quality/removePerfectionOnEndFloors";
import * as removePerfectionVelocity from "../features/optional/quality/removePerfectionVelocity";
import * as speedrunPostPickupInit from "../features/speedrun/callbacks/postPickupInit";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_PICKUP_INIT, main);

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    heart,
    PickupVariant.HEART, // 10
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    coin,
    PickupVariant.COIN, // 20
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    collectible,
    PickupVariant.COLLECTIBLE, // 100
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
    trinket,
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
function heart(pickup: EntityPickup) {
  scaredHeart.postPickupInitHeart(pickup);
}

// PickupVariant.COIN (20)
function coin(pickup: EntityPickup) {
  stickyNickel.postPickupInitCoin(pickup);
}

// PickupVariant.COLLECTIBLE (100)
function collectible(pickup: EntityPickup) {
  fastKrampus.postPickupInitCollectible(pickup);
  fastAngels.postPickupInitCollectible(pickup);
  flipCustom.postPickupInitCollectible(pickup);
  flyItemSprites.postPickupInitCollectible(pickup);
  twentyTwenty.postPickupInitCollectible(pickup);
  starOfBethlehem.postPickupInitCollectible(pickup);
}

// PickupVariant.TAROT_CARD (300)
function tarotCard(pickup: EntityPickup) {
  uniqueCardBacks.postPickupInitTarotCard(pickup);
}

// PickupVariant.BIG_CHEST (340)
function bigChest(pickup: EntityPickup) {
  fastTravelPostPickupInit.bigChest(pickup);
}

// PickupVariant.TRINKET (350)
function trinket(pickup: EntityPickup) {
  removePerfectionVelocity.postPickupInitTrinket(pickup);
  removePerfectionOnEndFloors.postPickupInitTrinket(pickup);
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
