import { ModCallbackCustom } from "isaacscript-common";
import { seededDeathPostFlip } from "../features/mandatory/seededDeath/callbacks/postFlip";
import * as startWithD6 from "../features/optional/major/startWithD6";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_FLIP, main);
}

function main(player: EntityPlayer) {
  // Mandatory
  seededDeathPostFlip(player);

  // Major
  startWithD6.postFlip(player);
}
