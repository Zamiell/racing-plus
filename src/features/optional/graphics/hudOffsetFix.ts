import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.hudOffsetFix) {
    return;
  }

  if (Options.HUDOffset === 1) {
    Options.HUDOffset = 0;
  }
}
