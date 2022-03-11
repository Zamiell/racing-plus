import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";
import { racePostFirstFlip } from "../features/race/callbacks/postFirstFlip";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_FIRST_FLIP, main);
}

function main(player: EntityPlayer) {
  startWithD6.postFirstFlip(player);
  racePostFirstFlip(player);
}
