import { config } from "../../../../../modConfigMenu";
import { initBetterDevilAngelRoomsRNG } from "../v";

export function betterDevilAngelRoomsPostGameStarted(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

  initBetterDevilAngelRoomsRNG();
}
