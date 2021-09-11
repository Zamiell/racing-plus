import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as fastTravelPostGridEntityRemove from "../features/optional/major/fastTravel/callbacks/postGridEntityRemove";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE,
    trapdoor,
    GridEntityType.GRID_TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE,
    crawlspace,
    GridEntityType.GRID_STAIRS, // 18
  );
}

// GridEntityType.GRID_TRAPDOOR (17)
function trapdoor(gridIndex: int) {
  fastTravelPostGridEntityRemove.trapdoor(gridIndex);
}

// GridEntityType.GRID_STAIRS (18)
function crawlspace(gridIndex: int) {
  fastTravelPostGridEntityRemove.crawlspace(gridIndex);
}
