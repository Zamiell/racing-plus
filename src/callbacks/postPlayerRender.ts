import { isChildPlayer } from "isaacscript-common";
import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";
import * as azazelsRageChargeBar from "../features/optional/quality/azazelsRageChargeBar";
import * as bloodyLustChargeBar from "../features/optional/quality/bloodyLustChargeBar/bloodyLustChargeBar";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";
import * as taintedSamsonChargeBar from "../features/optional/quality/taintedSamsonChargeBar";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_RENDER, main);
}

function main(player: EntityPlayer) {
  if (isChildPlayer(player)) {
    return;
  }

  // QoL
  taintedSamsonChargeBar.postPlayerRender(player);
  bloodyLustChargeBar.postPlayerRender(player); // 444
  leadPencilChargeBar.postPlayerRender(player); // 444
  azazelsRageChargeBar.postPlayerRender(player); // 699

  // Cutscenes
  fastTeleports.postPlayerRender(player);
}
