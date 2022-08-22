import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { fastTravelPostGridEntityStateChangedTeleporter } from "../features/optional/major/fastTravel/callbacks/postGridEntityStateChanged";
import { speedrunPostGridEntityStateChangedTeleporter } from "../features/speedrun/callbacks/postGridEntityStateChanged";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED,
    teleporter,
    GridEntityType.TELEPORTER, // 23
  );
}

// GridEntityType.TELEPORTER (23)
function teleporter(gridEntity: GridEntity, oldState: int, newState: int) {
  fastTravelPostGridEntityStateChangedTeleporter(
    gridEntity,
    oldState,
    newState,
  );
  speedrunPostGridEntityStateChangedTeleporter(gridEntity, oldState, newState);
}
