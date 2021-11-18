import { isPostBossVoidPortal, removeGridEntity } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGridEntity(gridEntity);
  }
}
