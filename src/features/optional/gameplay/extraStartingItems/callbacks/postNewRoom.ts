import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";

export default function extraStartingItemsPostNewRoom(): void {
  if (!config.extraStartingItems) {
    return;
  }

  extraStartingItems.postNewRoom();
}
