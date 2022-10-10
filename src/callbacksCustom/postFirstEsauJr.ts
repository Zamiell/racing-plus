import { ModCallbackCustom } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_FIRST_ESAU_JR, main);
}

function main(player: EntityPlayer) {
  startWithD6.postFirstEsauJr(player);
}
