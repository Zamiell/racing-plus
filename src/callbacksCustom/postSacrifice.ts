import { ModCallbackCustom } from "isaacscript-common";
import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import * as showNumSacrifices from "../features/optional/quality/showNumSacrifices";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SACRIFICE, main);
}

function main(_player: EntityPlayer, numSacrifices: int) {
  // Mandatory
  preventSacrificeRoomTeleport.postSacrifice(numSacrifices);

  // QoL
  showNumSacrifices.postSacrifice(numSacrifices);
}
