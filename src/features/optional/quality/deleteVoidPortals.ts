import { isPostBossVoidPortal, removeGrid } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.TRAPDOOR (17)
export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGrid(gridEntity);
  }
}
