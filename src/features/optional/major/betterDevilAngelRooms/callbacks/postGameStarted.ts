import { config } from "../../../../../modConfigMenu";
import { initializeSeeds } from "../v";

export function betterDevilAngelRoomsPostGameStarted(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

  initializeSeeds();
}
