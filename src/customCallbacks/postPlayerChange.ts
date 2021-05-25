import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";
import { getPlayers } from "../misc";

export function postUpdate(): void {
  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character !== g.run.currentCharacters.get(player.ControllerIndex)) {
      g.run.currentCharacters.set(player.ControllerIndex, character);
      postPlayerChange(player);
    }
  }
}

function postPlayerChange(player: EntityPlayer) {
  startWithD6.postPlayerChange(player);
}
