import { isChildPlayer } from "isaacscript-common";
import * as debugFunction from "../debugFunction";
import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_RENDER, main);
}

function main(player: EntityPlayer) {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  debugFunction.postPlayerRender(player);

  // Cutscenes
  fastTeleports.postPlayerRender(player);
}
