import { config } from "../../../../../modConfigMenu";
import * as crawlSpace from "../crawlSpace";

// ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED
// GridEntityType.TELEPORTER (23)
export function fastTravelPostGridEntityStateChangedTeleporter(
  _gridEntity: GridEntity,
  _oldState: int,
  newState: int,
): void {
  if (!config.fastTravel) {
    return;
  }

  crawlSpace.postGridEntityStateChangedTeleporter(newState);
}
