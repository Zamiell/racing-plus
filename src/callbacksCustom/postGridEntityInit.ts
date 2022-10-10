import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as fastTravelPostGridEntityInit from "../features/optional/major/fastTravel/callbacks/postGridEntityInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    trapdoor,
    GridEntityType.TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    crawlSpace,
    GridEntityType.CRAWL_SPACE, // 18
  );
}

// GridEntityType.TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  fastTravelPostGridEntityInit.trapdoor(gridEntity);
}

// GridEntityType.CRAWL_SPACE (18)
function crawlSpace(gridEntity: GridEntity) {
  fastTravelPostGridEntityInit.crawlSpace(gridEntity);
}
