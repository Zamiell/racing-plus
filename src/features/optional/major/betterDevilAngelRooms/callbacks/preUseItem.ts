import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import v from "../v";

export function betterDevilAngelRoomsPreUseItemD4(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

  // Record the frame that the build is rerolled so that this feature will not affect getting the
  // replacement items
  // This callback is fired for D4, D100, 1-pip dice rooms, and 6-pip dice rooms
  const gameFrameCount = g.g.GetFrameCount();
  v.room.usedD4Frame = gameFrameCount;
}
