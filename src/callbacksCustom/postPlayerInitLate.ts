import { ModCallbackCustom } from "isaacscript-common";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";
import { speedrunPostPlayerInitLate } from "../features/speedrun/callbacks/postPlayerInitLate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_LATE, main);
}

function main(player: EntityPlayer) {
  speedrunPostPlayerInitLate(player);
  disableMultiplayer.postPlayerInitLate(player);
}
