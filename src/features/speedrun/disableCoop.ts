import v from "./v";

// ModCallbacks.MC_POST_PLAYER_INIT (9)
export function postPlayerInit(player: EntityPlayer): void {
  if (v.run.firstPlayerIndex === null) {
    v.run.firstPlayerIndex = player.ControllerIndex;
  }
}

// ModCallbacks.MC_INPUT_ACTION (13)
// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.ACTION_JOINMULTIPLAYER (19)
export function inputActionIsActionTriggeredJoinMultiplayer(): boolean | void {
  return false;
}

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(shouldSave: boolean): void {
  if (!shouldSave) {
    v.run.firstPlayerIndex = null;
  }
}
