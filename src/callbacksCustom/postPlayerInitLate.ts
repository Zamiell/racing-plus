import { ModCallbackCustom } from "isaacscript-common";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_LATE, main);
}

function main(player: EntityPlayer) {
  disableMultiplayer.postPlayerInitLate(player);
}
