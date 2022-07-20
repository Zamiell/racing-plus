import { isPostBossVoidPortal, removeGridEntity } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallbackCustom.POST_GRID_ENTITY_UPDATE
// GridEntityType.TRAPDOOR (17)
export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGridEntity(gridEntity, false);
  }
}
