import g from "../globals";
import { initPlayerVariables } from "../types/GlobalsRun";

export function main(player: EntityPlayer): void {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount === 0) {
    cachePlayerObject(player);
  } else {
    // If this is the start of a new run,
    // we cannot initialize player variables because the "g.run" table is not initialized yet
    initPlayerVariables(player, g.run);
  }
}

function cachePlayerObject(player: EntityPlayer) {
  // The 0th player is cached on every PostNewRoom and every PostRender
  // However, PostPlayerInit fires before these callbacks, so we also cache it here
  const character = player.GetPlayerType();
  if (
    character !== PlayerType.PLAYER_ESAU &&
    character !== PlayerType.PLAYER_THESOUL_B
  ) {
    g.p = player;
  }
}
