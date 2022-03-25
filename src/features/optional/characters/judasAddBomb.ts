// We grant Judas an extra bomb so that the character is slightly more skill based

import { getPlayersOfType } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.judasAddBomb) {
    return;
  }

  const judases = getPlayersOfType(PlayerType.PLAYER_JUDAS);
  for (const judas of judases) {
    judas.AddBombs(1);
  }
}
