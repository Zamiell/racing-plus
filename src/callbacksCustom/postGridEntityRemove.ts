import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as fastTravelPostGridEntityRemove from "../features/optional/major/fastTravel/callbacks/postGridEntityRemove";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE,
    trapdoor,
    GridEntityType.TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE,
    crawlSpace,
    GridEntityType.CRAWL_SPACE, // 18
  );
}

// GridEntityType.TRAPDOOR (17)
function trapdoor(gridIndex: int) {
  fastTravelPostGridEntityRemove.trapdoor(gridIndex);
}

// GridEntityType.CRAWL_SPACE (18)
function crawlSpace(gridIndex: int) {
  fastTravelPostGridEntityRemove.crawlSpace(gridIndex);
}
