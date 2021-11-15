import { removeGridEntity } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { isPostBossVoidPortal } from "../../../util";

export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGridEntity(gridEntity);
  }
}
