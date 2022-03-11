import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as seededTeleports from "../features/mandatory/seededTeleports";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_CURSED_TELEPORT, main);
}

function main(player: EntityPlayer) {
  seededTeleports.postCursedTeleport(player);
}
