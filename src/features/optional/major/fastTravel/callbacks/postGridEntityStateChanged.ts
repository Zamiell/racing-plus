import { config } from "../../../../../modConfigMenu";
import * as crawlSpace from "../crawlSpace";

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
