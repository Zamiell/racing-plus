import { isChildPlayer, ModCallbackCustom } from "isaacscript-common";
import * as bloodyLustChargeBar from "../features/optional/quality/bloodyLustChargeBar/bloodyLustChargeBar";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";
import * as taintedSamsonChargeBar from "../features/optional/quality/taintedSamsonChargeBar";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED, main);
}

function main(player: EntityPlayer) {
  if (isChildPlayer(player)) {
    return;
  }

  // QoL
  taintedSamsonChargeBar.postPlayerRender(player);
  bloodyLustChargeBar.postPlayerRender(player); // 444
  leadPencilChargeBar.postPlayerRender(player); // 444
}
