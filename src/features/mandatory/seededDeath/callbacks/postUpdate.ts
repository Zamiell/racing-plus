import { isJacobOrEsau } from "isaacscript-common";
import g from "../../../../globals";
import { SeededDeathState } from "../../../../types/SeededDeathState";
import {
  applySeededGhostFade,
  logSeededDeathStateChange,
  shouldSeededDeathFeatureApply,
} from "../seededDeath";
import { debuffOff } from "../seededDeathDebuff";
import v from "../v";

// ModCallbacks.MC_POST_UPDATE (1)
export function seededDeathPostUpdate(): void {
  if (!shouldSeededDeathFeatureApply()) {
    return;
  }

  postUpdateGhostForm();
  postUpdateCheckTakingDevilItem();
}

function postUpdateGhostForm() {
  if (v.run.state !== SeededDeathState.GHOST_FORM) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();

  // We have to re-apply the fade on every frame in case the player takes a pill or steps on cobwebs
  applySeededGhostFade(player, true);

  // Check to see if the debuff is over
  if (v.run.debuffEndFrame === null || isaacFrameCount < v.run.debuffEndFrame) {
    return;
  }

  v.run.state = SeededDeathState.DISABLED;
  v.run.debuffEndFrame = null;
  logSeededDeathStateChange();

  debuffOff(player);
  player.AnimateHappy();
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      debuffOff(twin);
      twin.AnimateHappy();
    }
  }
}

function postUpdateCheckTakingDevilItem() {
  const devilRoomDeals = g.g.GetDevilRoomDeals();
  const gameFrameCount = g.g.GetFrameCount();

  if (devilRoomDeals !== v.run.devilRoomDeals) {
    v.run.devilRoomDeals = devilRoomDeals;
    v.run.frameOfLastDevilDeal = gameFrameCount;
  }
}
