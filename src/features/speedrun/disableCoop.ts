import v from "./v";

// ModCallbacks.MC_POST_PLAYER_INIT (9)
export function postPlayerInit(player: EntityPlayer): void {
  if (v.run.firstPlayerIndex === null) {
    v.run.firstPlayerIndex = player.ControllerIndex;
  } else {
    player.Kill();
  }
}

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(shouldSave: boolean): void {
  if (!shouldSave) {
    v.run.firstPlayerIndex = null;
  }
}
