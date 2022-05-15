import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import * as showNumSacrifices from "../features/optional/quality/showNumSacrifices";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SACRIFICE, main);
}

function main(_player: EntityPlayer, numSacrifices: int) {
  // Mandatory
  preventSacrificeRoomTeleport.postSacrifice(numSacrifices);

  // QoL
  showNumSacrifices.postSacrifice(numSacrifices);
}
