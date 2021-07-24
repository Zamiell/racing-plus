import * as startWithD6 from "../features/optional/major/startWithD6";
import { giveFormatItems } from "../features/race/callbacks/postGameStarted";
import g from "../globals";
import log from "../log";
import { getPlayers } from "../misc";
import { getPlayerLuaTableIndex } from "../types/GlobalsRun";

export function postUpdate(): void {
  // We must perform exclusions in the "getPlayers()" function because we don't want to have two
  // players on the same controller index
  for (const player of getPlayers(true)) {
    const character = player.GetPlayerType();
    const index = getPlayerLuaTableIndex(player);
    if (character !== g.run.currentCharacters.get(index)) {
      log(`Detected a character change for player: ${index}`);
      g.run.currentCharacters.set(index, character);
      postPlayerChange(player);
    }
  }
}

function postPlayerChange(player: EntityPlayer) {
  const character = player.GetPlayerType();
  startWithD6.postPlayerChange(player);

  if (
    character === PlayerType.PLAYER_LAZARUS2_B &&
    !g.run.laz2BGotStartingRaceItems
  ) {
    giveFormatItems(player);
    player.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6);
    g.run.laz2BGotStartingRaceItems = true;
  }
}
