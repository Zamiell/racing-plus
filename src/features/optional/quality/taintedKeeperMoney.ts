import { getPlayers } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function postGameStarted(): void {
  if (!config.taintedKeeperMoney) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_KEEPER_B) {
      player.AddCoins(15);
    }
  }
}
