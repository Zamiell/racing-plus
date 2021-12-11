import { config } from "../../../../../modConfigMenu";
import {
  getVisitedRoomBosses,
  getVisitedRoomCollectibles,
} from "../../../../mandatory/roomVisiter";
import * as sprites from "../sprites";
import v from "../v";

export function showDreamCatcherItemPostNewRoom(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  sprites.set();
  getItemsAndBosses();
}

function getItemsAndBosses() {
  v.level.collectibles = getVisitedRoomCollectibles();
  v.level.bosses = getVisitedRoomBosses();
}
