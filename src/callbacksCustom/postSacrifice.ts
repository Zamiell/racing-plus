import { ModCallbackCustom } from "isaacscript-common";
import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SACRIFICE, main);
}

function main(_player: EntityPlayer, numSacrifices: int) {
  // Mandatory
  preventSacrificeRoomTeleport.postSacrifice(numSacrifices);
}
