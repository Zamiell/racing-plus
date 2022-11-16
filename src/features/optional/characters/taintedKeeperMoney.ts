import { PlayerType } from "isaac-typescript-definitions";
import { getPlayersOfType } from "isaacscript-common";
import { RaceFormat } from "../../../enums/RaceFormat";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.taintedKeeperMoney) {
    return;
  }

  if (g.race.format === RaceFormat.SEEDED) {
    return;
  }

  const taintedKeepers = getPlayersOfType(PlayerType.KEEPER_B);
  for (const taintedKeeper of taintedKeepers) {
    taintedKeeper.AddCoins(15);
  }
}
