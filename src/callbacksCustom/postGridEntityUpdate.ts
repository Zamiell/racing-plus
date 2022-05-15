import { GridEntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as changeCharOrderPostGridEntityUpdate from "../features/changeCharOrder/callbacks/postGridEntityUpdate";
import * as fastTravelPostGridEntityUpdate from "../features/optional/major/fastTravel/callbacks/postGridEntityUpdate";
import * as deleteVoidPortals from "../features/optional/quality/deleteVoidPortals";
import * as racePostGridEntityUpdate from "../features/race/callbacks/postGridEntityUpdate";

export function init(mod: ModUpgraded): void {
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

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    pressurePlate,
    GridEntityType.PRESSURE_PLATE, // 20
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    teleporter,
    GridEntityType.TELEPORTER, // 23
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

// GridEntityType.PRESSURE_PLATE (20)
function pressurePlate(gridEntity: GridEntity) {
  changeCharOrderPostGridEntityUpdate.pressurePlate(gridEntity);
  racePostGridEntityUpdate.pressurePlate(gridEntity);
}

// GridEntityType.TELEPORTER (23)
function teleporter(gridEntity: GridEntity) {
  fastTravelPostGridEntityUpdate.teleporter(gridEntity);
}
