import { speedrunPostGameEnd } from "../features/speedrun/callbacks/postGameEnd";

export function main(isGameOver: boolean): void {
  speedrunPostGameEnd(isGameOver);
}
