import { PlayerType } from "isaac-typescript-definitions";
import { getPlayersOfType } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.taintedKeeperMoney) {
    return;
  }

  const taintedKeepers = getPlayersOfType(PlayerType.KEEPER_B);
  for (const taintedKeeper of taintedKeepers) {
    taintedKeeper.AddCoins(15);
  }
}
