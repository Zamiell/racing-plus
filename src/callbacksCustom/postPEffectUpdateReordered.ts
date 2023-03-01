import { isChildPlayer, ModCallbackCustom } from "isaacscript-common";
import * as roll from "../features/optional/hotkeys/roll";
import { fastTravelPostPEffectUpdate } from "../features/optional/major/fastTravel/callbacks/postPEffectUpdate";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
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

  // QoL
  chargePocketItemFirst.postPEffectUpdate(player);

  // Other
  roll.postPEffectUpdate(player);
}
