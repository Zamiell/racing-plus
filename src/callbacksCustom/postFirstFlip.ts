import { ModCallbackCustom } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";
import { racePostFirstFlip } from "../features/race/callbacks/postFirstFlip";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_FIRST_FLIP, main);
}

function main(player: EntityPlayer) {
  startWithD6.postFirstFlip(player);
  racePostFirstFlip(player);
}
