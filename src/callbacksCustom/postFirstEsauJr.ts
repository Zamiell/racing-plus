import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_FIRST_ESAU_JR, main);
}

function main(player: EntityPlayer) {
  startWithD6.postFirstEsauJr(player);
}
