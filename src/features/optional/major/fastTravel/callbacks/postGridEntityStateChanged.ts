import * as crawlSpace from "../../../../../classes/features/optional/major/fastTravel/crawlSpace";
import { config } from "../../../../../modConfigMenu";

// GridEntityType.TELEPORTER (23)
export function fastTravelPostGridEntityStateChangedTeleporter(
  _gridEntity: GridEntity,
  _oldState: int,
  newState: int,
): void {
  if (!config.FastTravel) {
    return;
  }

  crawlSpace.postGridEntityStateChangedTeleporter(newState);
}
