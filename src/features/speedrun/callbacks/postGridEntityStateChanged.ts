import { season3PostGridEntityStateChangedTeleporter } from "../season3/callbacks/postGridEntityStateChanged";
import { inSpeedrun } from "../speedrun";

// GridEntityType.TELEPORTER (23)
export function speedrunPostGridEntityStateChangedTeleporter(
  gridEntity: GridEntity,
  oldState: int,
  newState: int,
): void {
  if (!inSpeedrun()) {
    return;
  }

  season3PostGridEntityStateChangedTeleporter(gridEntity, oldState, newState);
}
