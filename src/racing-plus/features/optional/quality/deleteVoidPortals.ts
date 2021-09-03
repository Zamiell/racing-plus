import { config } from "../../../modConfigMenu";
import { isPostBossVoidPortal } from "../../../util";
import { removeGridEntity } from "../../../utilGlobals";

export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGridEntity(gridEntity);
  }
}
