import { ModCallback } from "isaac-typescript-definitions";
import { speedrunPostGameEnd } from "../features/speedrun/callbacks/postGameEnd";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_GAME_END, main);
}

function main(isGameOver: boolean) {
  speedrunPostGameEnd(isGameOver);
}
