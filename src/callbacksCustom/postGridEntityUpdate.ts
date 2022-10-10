import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as fastTravelPostGridEntityUpdate from "../features/optional/major/fastTravel/callbacks/postGridEntityUpdate";
import * as deleteVoidPortals from "../features/optional/quality/deleteVoidPortals";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    trapdoor,
    GridEntityType.TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    crawlSpace,
    GridEntityType.CRAWL_SPACE, // 18
  );
}

// GridEntityType.TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  fastTravelPostGridEntityUpdate.trapdoor(gridEntity);
  deleteVoidPortals.postGridEntityUpdateTrapdoor(gridEntity);
}

// GridEntityType.CRAWL_SPACE (18)
function crawlSpace(gridEntity: GridEntity) {
  fastTravelPostGridEntityUpdate.crawlSpace(gridEntity);
}
