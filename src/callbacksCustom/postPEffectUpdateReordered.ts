import { isChildPlayer, ModCallbackCustom } from "isaacscript-common";
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
}
