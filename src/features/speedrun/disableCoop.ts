import { isChildPlayer } from "isaacscript-common";
import v from "./v";

// ModCallbacks.MC_POST_PLAYER_INIT (9)
export function postPlayerInit(player: EntityPlayer): void {
  if (v.run.firstPlayerIndex === null) {
    v.run.firstPlayerIndex = player.ControllerIndex;
  }
}

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(shouldSave: boolean): void {
  if (!shouldSave) {
    v.run.firstPlayerIndex = null;
  }
}

// ModCallbacksCustom.MC_POST_PLAYER_INIT_LATE
export function postPlayerInitLate(player: EntityPlayer): void {
  if (!isChildPlayer(player)) {
    return;
  }

  if (player.ControllerIndex !== v.run.firstPlayerIndex && player.IsDead()) {
    player.Kill();
  }
}
