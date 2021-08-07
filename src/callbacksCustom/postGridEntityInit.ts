import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as fastTravelPostGridEntityInit from "../features/optional/major/fastTravel/callbacks/postGridEntityInit";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT,
    trapdoor,
    GridEntityType.GRID_TRAPDOOR,
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT,
    crawlspace,
    GridEntityType.GRID_STAIRS,
  );
}

// GridEntityType.GRID_TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  fastTravelPostGridEntityInit.trapdoor(gridEntity);
}

// GridEntityType.GRID_STAIRS (18)
function crawlspace(gridEntity: GridEntity) {
  fastTravelPostGridEntityInit.crawlspace(gridEntity);
}
