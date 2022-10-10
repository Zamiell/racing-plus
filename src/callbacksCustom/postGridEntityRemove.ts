import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as fastTravelPostGridEntityRemove from "../features/optional/major/fastTravel/callbacks/postGridEntityRemove";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_REMOVE,
    trapdoor,
    GridEntityType.TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_REMOVE,
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
