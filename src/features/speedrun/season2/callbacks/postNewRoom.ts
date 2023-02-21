import { mod } from "../../../../mod";
import { onSeason } from "../../speedrun";
import { resetSeason2StartingRoomSprites } from "../startingRoomSprites";

export function season2PostNewRoom(): void {
  if (!onSeason(2)) {
    return;
  }

  if (!mod.inFirstRoom()) {
    resetSeason2StartingRoomSprites();
  }
}
