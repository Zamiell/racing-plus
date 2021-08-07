// We grant Judas an extra bomb so that the character is slightly more skill based
// The same mechanic also applies to Dark Judas

import { getPlayers } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function postGameStarted(): void {
  if (!config.judasAddBomb) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_JUDAS) {
      player.AddBombs(1);
    }
  }
}
