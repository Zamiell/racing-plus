import { isChildPlayer, ModCallbackCustom } from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as solCustom from "../features/items/solCustom";
import * as batteryBumFix from "../features/optional/bugfix/batteryBumFix";
import { extraStartingItemsPostPEffectUpdate } from "../features/optional/gameplay/extraStartingItems/callbacks/postPEffectUpdate";
import { fastTravelPostPEffectUpdate } from "../features/optional/major/fastTravel/callbacks/postPEffectUpdate";
import * as roll from "../features/optional/other/roll";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";
import { racePostPEffectUpdate } from "../features/race/callbacks/postPEffectUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  racePostPEffectUpdate(player);
  fastTravelPostPEffectUpdate(player);

  // Gameplay
  combinedDualityDoors.postPEffectUpdate(player);
  extraStartingItemsPostPEffectUpdate(player);

  // QoL
  chargePocketItemFirst.postPEffectUpdate(player);

  // Bug fixes
  batteryBumFix.postPEffectUpdate(player);

  // Items
  flipCustom.postPEffectUpdate(player);
  solCustom.postPEffectUpdate(player);

  // Other
  roll.postPEffectUpdate(player);
}
