import { config } from "../../../../../modConfigMenu";
import { initializeSeeds } from "../v";

export default function betterDevilAngelRoomsPostGameStarted(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

  initializeSeeds();
}
