import { isChildPlayer } from "isaacscript-common";
import g from "../../globals";
import v from "./v";

// ModCallbacks.MC_POST_PLAYER_INIT (9)
export function postPlayerInit(player: EntityPlayer): void {
  if (v.run.firstPlayerControllerIndex === null) {
    v.run.firstPlayerControllerIndex = player.ControllerIndex;
  }
}

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(shouldSave: boolean): void {
  if (!shouldSave) {
    v.run.firstPlayerControllerIndex = null;
  }
}

// ModCallbacksCustom.MC_POST_PLAYER_INIT_LATE
export function postPlayerInitLate(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  if (player.ControllerIndex !== v.run.firstPlayerControllerIndex) {
    // A new player has arrived that is not the first player,
    // so they must be trying to initiate a multiplayer game
    // Prevent this from happening by fading out to an ending
    g.g.Fadeout(0.5, FadeoutTarget.FILE_SELECT);
  }
}
