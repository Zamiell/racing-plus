import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as fastTravelPostGridEntityInit from "../features/optional/major/fastTravel/callbacks/postGridEntityInit";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT,
    trapdoor,
    GridEntityType.TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT,
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
