import { isChildPlayer } from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as sawblade from "../features/items/sawblade";
import { fastTravelPostPEffectUpdate } from "../features/optional/major/fastTravel/callbacks/postPEffectUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as roll from "../features/optional/other/roll";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  startWithD6.postPEffectUpdate(player);
  fastTravelPostPEffectUpdate(player);

  // Gameplay
  combinedDualityDoors.postPEffectUpdate(player);

  // QoL
  chargePocketItemFirst.postPEffectUpdate(player);

  // Items
  flipCustom.postPEffectUpdate(player);
  sawblade.postPEffectUpdate(player);

  // Other
  roll.postPEffectUpdate(player);
}
