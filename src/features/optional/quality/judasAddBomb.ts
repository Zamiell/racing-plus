// We grant Judas an extra bomb so that the character is slightly more skill based
// The same mechanic also applies to Dark Judas

import { getPlayers } from "isaacscript-common";
import g from "../../../globals";

export function postGameStarted(): void {
  if (!g.config.judasAddBomb) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (
      character === PlayerType.PLAYER_JUDAS ||
      character === PlayerType.PLAYER_BLACKJUDAS
    ) {
      player.AddBombs(1);
    }
  }
}
