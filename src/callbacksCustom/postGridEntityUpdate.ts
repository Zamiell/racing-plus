import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as changeCharOrderPostGridEntityUpdate from "../features/changeCharOrder/callbacks/postGridEntityUpdate";
import * as fastTravelPostGridEntityUpdate from "../features/optional/major/fastTravel/callbacks/postGridEntityUpdate";
import * as deleteVoidPortals from "../features/optional/quality/deleteVoidPortals";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE,
    trapdoor,
    GridEntityType.GRID_TRAPDOOR, // 17
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE,
    crawlspace,
    GridEntityType.GRID_STAIRS, // 18
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE,
    pressurePlate,
    GridEntityType.GRID_PRESSURE_PLATE, // 20
  );
}

// GridEntityType.GRID_TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  fastTravelPostGridEntityUpdate.trapdoor(gridEntity);
  deleteVoidPortals.postGridEntityUpdateTrapdoor(gridEntity);
}

// GridEntityType.GRID_STAIRS (18)
function crawlspace(gridEntity: GridEntity) {
  fastTravelPostGridEntityUpdate.crawlspace(gridEntity);
}

// GridEntityType.GRID_PRESSURE_PLATE (20)
function pressurePlate(gridEntity: GridEntity) {
  changeCharOrderPostGridEntityUpdate.pressurePlate(gridEntity);
}
