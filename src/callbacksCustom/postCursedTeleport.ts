import { ModCallbackCustom } from "isaacscript-common";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_CURSED_TELEPORT, main);
}

function main(player: EntityPlayer) {
  seededTeleports.postCursedTeleport(player);
}
