import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";

export function extraStartingItemsPostNewRoom(): void {
  if (!config.ExtraStartingItems) {
    return;
  }

  extraStartingItems.postNewRoom();
}
