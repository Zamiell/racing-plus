import g from "../../../globals";
import { getPlayers } from "../../../utilGlobals";

export function postGameStarted(): void {
  if (!g.config.judasAddBomb) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_JUDAS) {
      player.AddBombs(1);
    }
  }
}
