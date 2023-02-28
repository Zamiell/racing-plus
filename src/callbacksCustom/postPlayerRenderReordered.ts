import { isChildPlayer, ModCallbackCustom } from "isaacscript-common";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED, main);
}

function main(player: EntityPlayer) {
  if (isChildPlayer(player)) {
    return;
  }

  // QoL
  leadPencilChargeBar.postPlayerRender(player); // 444
}
