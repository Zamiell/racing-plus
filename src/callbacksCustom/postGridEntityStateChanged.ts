import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { fastTravelPostGridEntityStateChangedTeleporter } from "../features/optional/major/fastTravel/callbacks/postGridEntityStateChanged";
import { season3PostGridEntityStateChangedTeleporter } from "../features/speedrun/season3/callbacks/postGridEntityUpdate";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED,
    teleporter,
    GridEntityType.TELEPORTER,
  );
}

function teleporter(gridEntity: GridEntity, oldState: int, newState: int) {
  fastTravelPostGridEntityStateChangedTeleporter(
    gridEntity,
    oldState,
    newState,
  );
  season3PostGridEntityStateChangedTeleporter(gridEntity, oldState, newState);
}
