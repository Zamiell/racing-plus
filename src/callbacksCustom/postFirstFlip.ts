import { ModCallbackCustom } from "isaacscript-common";
import { racePostFirstFlip } from "../features/race/callbacks/postFirstFlip";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_FIRST_FLIP, main);
}

function main(player: EntityPlayer) {
  racePostFirstFlip(player);
}
