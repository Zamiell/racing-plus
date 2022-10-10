import { ModCallback } from "isaac-typescript-definitions";
import { speedrunPostGameEnd } from "../features/speedrun/callbacks/postGameEnd";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_GAME_END, main);
}

function main(isGameOver: boolean) {
  speedrunPostGameEnd(isGameOver);
}
