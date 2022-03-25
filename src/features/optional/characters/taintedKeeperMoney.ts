import { getPlayersOfType } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.taintedKeeperMoney) {
    return;
  }

  const taintedKeepers = getPlayersOfType(PlayerType.PLAYER_KEEPER_B);
  for (const taintedKeeper of taintedKeepers) {
    taintedKeeper.AddCoins(15);
  }
}
