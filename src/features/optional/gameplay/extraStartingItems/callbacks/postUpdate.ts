import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";

export default function extraStartingItemsPostUpdate(): void {
  if (!config.extraStartingItems) {
    return;
  }

  extraStartingItems.postUpdate();
}
