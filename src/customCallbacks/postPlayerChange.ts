import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";
import { getPlayerLuaTableIndex, getPlayers } from "../misc";

export function postUpdate(): void {
  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    const index = getPlayerLuaTableIndex(player);
    if (character !== g.run.currentCharacters.get(index)) {
      g.run.currentCharacters.set(index, character);
      postPlayerChange(player);
    }
  }
}

function postPlayerChange(player: EntityPlayer) {
  startWithD6.postPlayerChange(player);
}
