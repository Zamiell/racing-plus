import { speedrunPostGameEnd } from "../features/speedrun/callbacks/postGameEnd";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_GAME_END, main);
}

function main(isGameOver: boolean) {
  speedrunPostGameEnd(isGameOver);
}
