import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { onSeason } from "../../speedrun";
import { resetSeason2StartingRoomSprites } from "../startingRoomSprites";

export function season2PostNewRoom(): void {
  if (!onSeason(2)) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();

  if (numRoomsEntered !== 1) {
    resetSeason2StartingRoomSprites();
  }
}
