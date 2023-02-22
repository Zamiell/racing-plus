import { config } from "../../../modConfigMenu";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.HUDOffsetFix) {
    return;
  }

  if (Options.HUDOffset === 1) {
    Options.HUDOffset = 0;
  }
}
